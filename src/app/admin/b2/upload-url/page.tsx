"use client";

import { useCallback, useState } from "react";
import {
  Layout,
  Typography,
  Card,
  Button,
  Space,
  Input,
  Tag,
  Tooltip,
  Row,
  Col,
  Divider,
  Alert,
  Steps,
  Upload,
  Segmented,
  Select,
  List,
  Descriptions,
  Progress,
  Result,
  Popconfirm,
  Switch,
  message,
  type UploadProps,
} from "antd";
import {
  AndroidOutlined,
  WindowsOutlined,
  AppleOutlined,
  CodeOutlined,
  UploadOutlined,
  RocketOutlined,
  ReloadOutlined,
  InboxOutlined,
  FileZipOutlined,
  LinkOutlined,
  CopyOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  getB2UploadUrl,
  listB2ReleaseFiles,
  deleteB2File,
  saveGameVersion,
  type B2FileInfo,
} from "./servers";
import { buildPublicUrl } from "@/lib/b2-storage";
import { classifyFile } from "@/lib/b2-classify";

const { Title, Text, Paragraph } = Typography;
const { Header, Content } = Layout;
const { Dragger } = Upload;

// ============================================================
// Cấu hình theo hệ điều hành
// ============================================================

type GameOS = "android" | "windows" | "linux" | "ios";

/**
 * Định dạng gói cho Linux. Mỗi định dạng là một file build riêng,
 * upload từng file một. Đuôi file tự nói lên distro nên key không
 * cần gắn thêm tên distro.
 */
type LinuxFormat = "deb" | "rpm" | "tar.gz" | "tar.zst" | "pkg.tar.zst" | "appimage";

type OSConfig = {
  label: string;
  icon: React.ReactNode;
  accept: string;
  extension: string;
  contentType: string;
  color: string;
};

const LINUX_FORMATS: Record<LinuxFormat, { label: string; extension: string }> = {
  deb: { label: "Debian / Ubuntu (.deb)", extension: ".deb" },
  rpm: { label: "Fedora / RHEL / openSUSE (.rpm)", extension: ".rpm" },
  "tar.gz": { label: "tar.gz (phổ thông)", extension: ".tar.gz" },
  "tar.zst": { label: "tar.zst (Arch, zstd)", extension: ".tar.zst" },
  "pkg.tar.zst": { label: "Arch package (.pkg.tar.zst)", extension: ".pkg.tar.zst" },
  appimage: { label: "AppImage (chạy mọi distro)", extension: ".AppImage" },
};

const LINUX_CONTENT_TYPES: Record<LinuxFormat, string> = {
  deb: "application/vnd.debian.binary-package",
  rpm: "application/x-rpm",
  "tar.gz": "application/gzip",
  "tar.zst": "application/zstd",
  "pkg.tar.zst": "application/zstd",
  appimage: "application/octet-stream",
};

const OS_CONFIG: Record<GameOS, OSConfig> = {
  android: {
    label: "Android",
    icon: <AndroidOutlined />,
    accept: ".apk",
    extension: ".apk",
    contentType: "application/vnd.android.package-archive",
    color: "#2E8B57", // success
  },
  windows: {
    label: "Windows",
    icon: <WindowsOutlined />,
    accept: ".zip",
    extension: ".zip",
    contentType: "application/zip",
    color: "#1E90FF", // info
  },
  linux: {
    label: "Linux",
    icon: <CodeOutlined />,
    // accept/extension được suy ra từ định dạng đang chọn (xem getActiveConfig)
    accept: "",
    extension: "",
    contentType: "",
    color: "#FF8C00", // warning
  },
  ios: {
    label: "iOS",
    icon: <AppleOutlined />,
    accept: ".ipa",
    extension: ".ipa",
    contentType: "application/octet-stream",
    color: "#8B4513", // nobleBrown
  },
};

const OS_OPTIONS = (Object.keys(OS_CONFIG) as GameOS[]).map((key) => ({
  label: (
    <Space size={6}>
      {OS_CONFIG[key].icon}
      {OS_CONFIG[key].label}
    </Space>
  ),
  value: key,
}));

const LINUX_FORMAT_OPTIONS = (
  Object.keys(LINUX_FORMATS) as LinuxFormat[]
).map((key) => ({
  label: LINUX_FORMATS[key].label,
  value: key,
}));

/**
 * Cấu hình hiệu lực: với Linux thì lấy extension/contentType từ định dạng
 * gói đang chọn, các OS khác lấy trực tiếp từ OS_CONFIG.
 */
function getActiveConfig(os: GameOS, linuxFormat: LinuxFormat): OSConfig {
  const base = OS_CONFIG[os];

  if (os !== "linux") return base;

  const format = LINUX_FORMATS[linuxFormat];

  return {
    ...base,
    accept: format.extension,
    extension: format.extension,
    contentType: LINUX_CONTENT_TYPES[linuxFormat],
  };
}

// ============================================================
// B2 helpers
// ============================================================

// Bucket công khai của game. Trước đây đọc NEXT_PUBLIC_B2_BUCKET_NAME và
// NEXT_PUBLIC_B2_DOWNLOAD_HOST nhưng hai biến đó chưa từng có trong .env.local
// nên getPublicUrl() luôn trả chuỗi rỗng và link tải không bao giờ hiện.
// Nay đọc từ src/lib/b2-storage.ts — một nguồn duy nhất, có fallback nên vẫn
// chạy khi chưa cấu hình env.
const B2_BUCKET_NAME = "12suquan";

/**
 * Tên file trên B2 theo quy ước mặc định:
 * game_su_quan_[version].[extension]
 * vd: "1.2.0" + android -> game_su_quan_1.2.0.apk
 *     "1.2.0" + linux/deb -> game_su_quan_1.2.0.deb
 *
 * Chỉ dùng khi KHÔNG bật chế độ tự đặt key.
 */
function buildB2FileName(version: string, extension: string): string {
  return `game_su_quan_${version.trim()}${extension}`;
}

/**
 * Key hợp lệ để upload: không rỗng, không bắt đầu bằng "/", không có "..",
 * không khoảng trắng, không "//".
 */
function validateManualKey(value: string): string | null {
  const key = value.trim();

  if (!key) return "Key không được để trống";
  if (key.startsWith("/")) return "Key không được bắt đầu bằng dấu /";
  if (key.includes("..")) return "Key không được chứa ..";
  if (key.includes("//")) return "Key không được chứa //";
  if (/\s/.test(key)) return "Key không được chứa khoảng trắng";

  return null;
}

function getPublicUrl(fileName: string): string {
  return buildPublicUrl(fileName);
}

/** Bỏ dấu tiếng Việt để dùng làm "slug" phiên bản an toàn cho tên file. */
function toVersionSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9._-]/g, "");
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

async function uploadToB2({
  uploadUrl,
  authorizationToken,
  file,
  fileName,
  contentType,
  onProgress,
  signal,
}: {
  uploadUrl: string;
  authorizationToken: string;
  file: File;
  fileName: string;
  contentType: string;
  onProgress: (progress: number) => void;
  signal?: AbortSignal;
}): Promise<{ fileId: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    const abort = () => xhr.abort();
    signal?.addEventListener("abort", abort);

    const cleanup = () => signal?.removeEventListener("abort", abort);

    xhr.open("POST", uploadUrl);

    xhr.setRequestHeader("Authorization", authorizationToken);
    xhr.setRequestHeader("X-Bz-File-Name", encodeURIComponent(fileName));
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.setRequestHeader("X-Bz-Content-Sha1", "do_not_verify");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress((event.loaded / event.total) * 100);
    };

    xhr.onload = () => {
      cleanup();

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText) as { fileId: string };
          resolve({ fileId: data.fileId });
        } catch {
          resolve({ fileId: "" });
        }
        return;
      }

      let detail = xhr.responseText;

      try {
        const parsed = JSON.parse(xhr.responseText) as {
          message?: string;
          code?: string;
        };
        detail = parsed.message ?? parsed.code ?? detail;
      } catch {
        /* giữ nguyên responseText */
      }

      reject(new Error(`Upload thất bại (${xhr.status}): ${detail}`));
    };

    xhr.onerror = () => {
      cleanup();
      reject(new Error("Không thể kết nối tới B2"));
    };

    xhr.onabort = () => {
      cleanup();
      reject(new Error("Upload đã bị hủy"));
    };

    xhr.send(file);
  });
}

// ============================================================
// Trang
// ============================================================

export default function UpdateGamePage() {
  const [version, setVersion] = useState("");
  const [os, setOs] = useState<GameOS>("android");
  const [linuxFormat, setLinuxFormat] = useState<LinuxFormat>("deb");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedSize, setUploadedSize] = useState(0);
  const [speed, setSpeed] = useState(0); // MB/s
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<{
    fileName: string;
    fileId: string;
    versionId: string;
    buildNumber: number;
  } | null>(null);
  const [releaseFiles, setReleaseFiles] = useState<B2FileInfo[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [releaseNotes, setReleaseNotes] = useState("");
  const [isMandatory, setIsMandatory] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [manualKey, setManualKey] = useState(false);
  const [customKey, setCustomKey] = useState("");

  const config = getActiveConfig(os, linuxFormat);
  const isLinux = os === "linux";
  const versionSlug = toVersionSlug(version);

  // Key tự đặt (nếu bật) thay thế hoàn toàn quy ước game_su_quan_[version].[ext].
  // Lý do có chế độ này: bucket đang tồn tại HAI quy ước song song, và không
  // quy ước nào suy ra được từ (os, version) — vd file cũ nằm trong
  // releases/linux/ với tên game_12_suquan-linux-x64.deb.
  const customKeyError = manualKey ? validateManualKey(customKey) : null;
  const effectiveKey = manualKey ? customKey.trim() : "";

  const fileName = manualKey
    ? effectiveKey
    : versionSlug
      ? buildB2FileName(versionSlug, config.extension)
      : "";

  const publicUrl = fileName ? getPublicUrl(fileName) : "";
  const isVersionValid = versionSlug.length > 0;
  const isDuplicate = releaseFiles.some((f) => f.fileName === fileName);

  // Cảnh báo khi key không khớp nền tảng nào đã biết: file vẫn upload được,
  // nhưng sẽ KHÔNG xuất hiện ở nút nền tảng nào trên /download.
  const keyClassification = manualKey && effectiveKey ? classifyFile(effectiveKey) : null;
  const unknownKey = manualKey && effectiveKey && !keyClassification?.os;

  const resetUploadState = () => {
    setProgress(0);
    setUploadedSize(0);
    setSpeed(0);
    setStep(0);
    setDone(null);
  };

  const handleOSChange = (value: GameOS) => {
    setOs(value);
    setFile(null);
    resetUploadState();
  };

  const handleLinuxFormatChange = (value: LinuxFormat) => {
    setLinuxFormat(value);
    setFile(null);
    resetUploadState();
  };

  /** Ant Design Upload: chặn upload tự động, chỉ nhận file vào state. */
  const beforeUpload: UploadProps["beforeUpload"] = (selectedFile) => {
    const accept = config.accept.split(",");

    const matched = accept.some((ext) =>
      selectedFile.name.toLowerCase().endsWith(ext.trim().toLowerCase())
    );

    if (!matched) {
      message.error(
        `${config.label} chỉ chấp nhận file ${accept.join(" hoặc ")}`
      );
      return Upload.LIST_IGNORE;
    }

    setFile(selectedFile);
    resetUploadState();

    // Trả về false => antd không tự upload, ta tự POST lên B2.
    return false;
  };

  const handleUpload = useCallback(async () => {
    if (!file) {
      message.warning("Vui lòng chọn file");
      return;
    }

    if (!fileName) {
      message.warning(
        manualKey ? "Vui lòng nhập key cho file" : "Vui lòng nhập phiên bản (version)"
      );
      return;
    }

    if (customKeyError) {
      message.warning(customKeyError);
      return;
    }

    try {
      setUploading(true);
      resetUploadState();
      setStep(1);

      const { uploadUrl, authorizationToken } = await getB2UploadUrl();
      setStep(2);

      const startedAt = Date.now();

      const { fileId } = await uploadToB2({
        uploadUrl,
        authorizationToken,
        file,
        fileName,
        contentType: file.type || config.contentType,
        onProgress: (percent) => {
          setProgress(percent);
          setUploadedSize((file.size * percent) / 100);

          const elapsed = (Date.now() - startedAt) / 1000;
          if (elapsed > 0.5) {
            setSpeed((file.size * (percent / 100)) / 1024 / 1024 / elapsed);
          }
        },
      });

      // Upload B2 xong mới ghi DB. Nếu ghi lỗi, file vẫn nằm trên B2 và
      // người dùng thấy lỗi rõ ràng để chạy lại (upsert nên không tạo trùng).
      setStep(3);
      setProgress(100);
      setUploadedSize(file.size);

      setStatusText("Đang ghi vào game_versions…");

      const row = await saveGameVersion({
        os,
        version: versionSlug || fileName,
        packageFormat: isLinux ? linuxFormat : "",
        b2Key: fileName,
        releaseNotes,
        isMandatory,
      });

      setDone({ fileName, fileId, versionId: row.id, buildNumber: row.build_number });
      setStatusText("");

      message.success(
        `Đã phát hành ${config.label} ${versionSlug || fileName} (build ${row.build_number})`
      );
    } catch (error) {
      console.error(error);
      setStep(0);
      setStatusText("");
      message.error(
        error instanceof Error ? error.message : "Upload thất bại"
      );
    } finally {
      setUploading(false);
    }
  }, [
    file,
    fileName,
    versionSlug,
    config.label,
    config.contentType,
    manualKey,
    customKeyError,
    os,
    isLinux,
    linuxFormat,
    releaseNotes,
    isMandatory,
  ]);

  const loadReleaseFiles = useCallback(async () => {
    try {
      setLoadingFiles(true);
      const files = await listB2ReleaseFiles();
      setReleaseFiles(files);
    } catch (error) {
      console.error(error);
      message.error(
        error instanceof Error
          ? error.message
          : "Không tải được danh sách file trên B2"
      );
    } finally {
      setLoadingFiles(false);
    }
  }, []);

  const copyValue = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    message.success(`Đã sao chép ${label}`);
  };

  const handleDelete = useCallback(
    async (record: B2FileInfo) => {
      try {
        setDeletingFileId(record.fileId);

        await deleteB2File({
          fileName: record.fileName,
          fileId: record.fileId,
        });

        setReleaseFiles((prev) =>
          prev.filter((f) => f.fileId !== record.fileId)
        );

        message.success(`Đã xóa ${record.fileName}`);
      } catch (error) {
        console.error(error);
        message.error(
          error instanceof Error ? error.message : "Xóa file thất bại"
        );
      } finally {
        setDeletingFileId(null);
      }
    },
    []
  );

  // ============================================================
  // Danh sách file release
  // ============================================================

  /**
   * Nền tảng + định dạng, suy từ tên file bằng bộ phân loại dùng chung
   * (src/lib/b2-classify.ts). Trước đây chỗ này tự khớp đuôi file — cách đó
   * không phân biệt được distro: "game_12_suquan-arch-x86_64.pkg.tar.zst" và
   * "...-linux-x64.pkg.tar.zst" cùng đuôi nên ra cùng nhãn.
   */
  const getFileAccent = (name: string) => {
    const cls = classifyFile(name);

    if (!cls.os) return null;

    return {
      label: cls.label ?? OS_CONFIG[cls.os as GameOS]?.label ?? cls.os,
      color: OS_CONFIG[cls.os as GameOS]?.color ?? "#8B4513",
    };
  };

  const renderReleaseItem = (item: B2FileInfo) => {
    const accent = getFileAccent(item.fileName);
    const isCurrent = item.fileName === fileName;
    const isDeleting = deletingFileId === item.fileId;

    return (
      <List.Item
        key={item.fileId}
        style={{
          padding: "14px 16px",
          borderRadius: 8,
          background: isCurrent ? "#FDF6E3" : "transparent",
          border: isCurrent
            ? "1px solid #D4AF37"
            : "1px solid transparent",
          transition: "background 0.2s",
          opacity: isDeleting ? 0.5 : 1,
        }}
        actions={[
          <Popconfirm
            key="delete"
            title="Xóa file này?"
            description={
              <span>
                <Text code>{item.fileName}</Text> sẽ bị xóa vĩnh viễn khỏi B2.
                Không hoàn tác được.
              </span>
            }
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(item)}
          >
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              loading={isDeleting}
              disabled={deletingFileId !== null && !isDeleting}
            />
          </Popconfirm>,
        ]}
      >
        <List.Item.Meta
          avatar={
            <FileZipOutlined
              style={{
                fontSize: 22,
                color: accent?.color ?? "#8B4513",
                marginTop: 2,
              }}
            />
          }
          title={
            <Space size={8} wrap>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  wordBreak: "break-all",
                }}
              >
                {item.fileName}
              </span>
              {isCurrent && (
                <Tag color="#D4AF37" style={{ marginInlineEnd: 0 }}>
                  đang chọn
                </Tag>
              )}
              {accent && (
                <Tag bordered={false} style={{ marginInlineEnd: 0 }}>
                  {accent.label}
                </Tag>
              )}
            </Space>
          }
          description={
            <span style={{ fontSize: 12, color: "#999" }}>
              {formatBytes(item.contentLength)}
            </span>
          }
        />

        {/* Thời gian — canh phải, nhỏ, xám nhạt */}
        <Text
          style={{
            fontSize: 12,
            color: "#999",
            whiteSpace: "nowrap",
            marginLeft: 16,
          }}
        >
          {new Date(item.uploadTimestamp).toLocaleString("vi-VN")}
        </Text>
      </List.Item>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#F5F5DC" }}>
      <Header
        style={{
          background: "#8B0000",
          borderBottom: "2px solid #D4AF37",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          height: "auto",
          minHeight: 64,
        }}
      >
        <CloudUploadOutlined style={{ fontSize: 26, color: "#D4AF37" }} />
        <Title level={4} style={{ color: "#F5F5DC", margin: 0 }}>
          Cập nhật phiên bản game
        </Title>
        <Tag
          color="transparent"
          style={{
            borderColor: "#D4AF37",
            color: "#D4AF37",
            marginLeft: "auto",
          }}
        >
          Backblaze B2
        </Tag>
      </Header>

      <Content style={{ padding: 24 }}>
        <Row gutter={[24, 24]}>
          {/* ------------------------------------------------ Cột trái: form */}
          <Col xs={24} lg={15}>
            <Card
              title={
                <Space>
                  <RocketOutlined style={{ color: "#8B0000" }} />
                  <span>Phát hành bản build mới</span>
                </Space>
              }
              extra={
                <Button
                  icon={<ReloadOutlined />}
                  onClick={loadReleaseFiles}
                  loading={loadingFiles}
                >
                  Tải danh sách trên B2
                </Button>
              }
            >
              {/* Bước 1: phiên bản */}
              <Space
                style={{ width: "100%", justifyContent: "space-between" }}
                align="center"
              >
                <Text strong>1. Phiên bản</Text>
                <Space size={8} align="center">
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Tự đặt key
                  </Text>
                  <Tooltip title="Bật để nhập key B2 đầy đủ thay vì theo quy ước game_su_quan_[version].{ext}. Dùng khi cần đặt key trong thư mục con, vd releases/linux/...">
                    <Switch
                      size="small"
                      checked={manualKey}
                      disabled={uploading}
                      onChange={(checked) => {
                        setManualKey(checked);
                        setCustomKey("");
                        resetUploadState();
                      }}
                    />
                  </Tooltip>
                </Space>
              </Space>

              <Paragraph type="secondary" style={{ marginBottom: 8 }}>
                {manualKey ? (
                  <>
                    Key B2 đầy đủ, kể cả thư mục con. Đuôi file quyết định file
                    thuộc nền tảng nào trên trang /download.
                  </>
                ) : (
                  <>
                    Key trên B2 sẽ có dạng{" "}
                    <Text code>game_su_quan_[version].&#123;ext&#125;</Text>
                  </>
                )}
              </Paragraph>

              {manualKey ? (
                <Input
                  size="large"
                  prefix={<Tag color="#8B4513">key</Tag>}
                  placeholder="vd: releases/linux/game_12_suquan-linux-x64.deb"
                  value={customKey}
                  disabled={uploading}
                  status={customKeyError ? "error" : undefined}
                  onChange={(e) => {
                    setCustomKey(e.target.value);
                    resetUploadState();
                  }}
                  allowClear
                />
              ) : (
                <Input
                  size="large"
                  prefix={<Tag color="#8B4513">version</Tag>}
                  placeholder="vd: 1.0.0"
                  value={version}
                  disabled={uploading}
                  onChange={(e) => {
                    setVersion(e.target.value);
                    resetUploadState();
                  }}
                  style={{ maxWidth: 360 }}
                  allowClear
                />
              )}

              {customKeyError && (
                <Alert
                  style={{ marginTop: 12 }}
                  type="error"
                  showIcon
                  message={customKeyError}
                />
              )}

              {unknownKey && (
                <Alert
                  style={{ marginTop: 12 }}
                  type="warning"
                  showIcon
                  message="Key không khớp nền tảng nào đã biết"
                  description={
                    <span>
                      File vẫn upload được, nhưng sẽ{" "}
                      <Text strong>không xuất hiện</Text> ở nút nền tảng nào
                      trên trang /download. Đặt tên có chứa{" "}
                      <Text code>windows</Text>, <Text code>linux</Text>,{" "}
                      <Text code>arch</Text>, <Text code>android</Text> hoặc
                      dùng đuôi quen thuộc (<Text code>.apk</Text>,{" "}
                      <Text code>.zip</Text>, <Text code>.deb</Text>,{" "}
                      <Text code>.rpm</Text>, <Text code>.AppImage</Text>) để
                      trang tải nhận ra.
                    </span>
                  }
                />
              )}

              {manualKey && keyClassification?.os && (
                <Alert
                  style={{ marginTop: 12 }}
                  type="success"
                  showIcon
                  message={`Nhận diện: ${keyClassification.label}`}
                />
              )}

              <Divider style={{ margin: "20px 0 16px" }} />

              {/* Bước 2: hệ điều hành */}
              <Text strong>2. Hệ điều hành</Text>
              <div style={{ marginTop: 12 }}>
                <Segmented
                  block
                  size="large"
                  value={os}
                  disabled={uploading}
                  options={OS_OPTIONS}
                  onChange={(value) => handleOSChange(value as GameOS)}
                />
              </div>

              {/* Bước 2b: định dạng gói Linux */}
              {isLinux && (
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Định dạng gói
                  </Text>
                  <Select
                    size="large"
                    style={{ width: "100%", marginTop: 6 }}
                    value={linuxFormat}
                    disabled={uploading}
                    options={LINUX_FORMAT_OPTIONS}
                    onChange={(value) =>
                      handleLinuxFormatChange(value as LinuxFormat)
                    }
                  />
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, display: "block", marginTop: 6 }}
                  >
                    Mỗi định dạng là một file riêng — upload lần lượt từng
                    file. Đuôi file tự nói lên distro nên key không gắn thêm
                    tên distro.
                  </Text>
                </div>
              )}

              <Divider style={{ margin: "20px 0 16px" }} />

              {/* Bước 3: file */}
              <Text strong>3. File build</Text>
              <div style={{ marginTop: 12 }}>
                <Dragger
                  key={`${os}-${linuxFormat}`}
                  name="file"
                  multiple={false}
                  accept={config.accept}
                  disabled={uploading}
                  beforeUpload={beforeUpload}
                  onRemove={() => {
                    setFile(null);
                    resetUploadState();
                  }}
                  maxCount={1}
                  fileList={
                    file
                      ? [
                          {
                            uid: "selected",
                            name: file.name,
                            size: file.size,
                            type: file.type,
                          },
                        ]
                      : []
                  }
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{ color: config.color }} />
                  </p>
                  <p className="ant-upload-text">
                    Kéo thả file {config.label} vào đây, hoặc bấm để chọn
                  </p>
                  <p className="ant-upload-hint">
                    Chấp nhận: {config.accept}
                    {file
                      ? ` — ${file.name} (${formatBytes(file.size)})`
                      : ""}
                  </p>
                </Dragger>
              </div>

              {isDuplicate && (
                <Alert
                  style={{ marginTop: 16 }}
                  type="warning"
                  showIcon
                  message="File này đã tồn tại trên B2"
                  description={
                    <span>
                      <Text code>{fileName}</Text> đã có trong bucket. Upload
                      sẽ ghi đè phiên bản cũ.
                    </span>
                  }
                />
              )}

              <Divider style={{ margin: "20px 0 16px" }} />

              {/* Bước 4: thông tin phát hành */}
              <Text strong>4. Thông tin phát hành</Text>
              <div style={{ marginTop: 12 }}>
                <Input.TextArea
                  rows={3}
                  maxLength={500}
                  showCount
                  disabled={uploading}
                  placeholder="Ghi chú phát hành (release notes) — không bắt buộc"
                  value={releaseNotes}
                  onChange={(e) => setReleaseNotes(e.target.value)}
                />

                <Space
                  style={{ marginTop: 12, width: "100%" }}
                  align="center"
                >
                  <Switch
                    size="small"
                    checked={isMandatory}
                    disabled={uploading}
                    onChange={setIsMandatory}
                  />
                  <Text>Bắt buộc cập nhật</Text>
                  <Tooltip title="Bản cũ sẽ bị chặn cho tới khi người chơi cập nhật lên bản này.">
                    <InfoCircleOutlined
                      style={{ color: "#999", fontSize: 13 }}
                    />
                  </Tooltip>
                </Space>
              </div>

              <Divider style={{ margin: "20px 0 16px" }} />

              <Button
                type="primary"
                size="large"
                block
                icon={<UploadOutlined />}
                disabled={!file || !fileName || !!customKeyError || uploading}
                loading={uploading}
                onClick={handleUpload}
              >
                {uploading
                  ? `Đang upload ${config.label}…`
                  : "UPLOAD & PHÁT HÀNH"}
              </Button>
            </Card>

            {/* Tiến trình */}
            {(uploading || step === 3) && (
              <Card style={{ marginTop: 24 }} title="Tiến trình">
                <Steps
                  size="small"
                  current={step}
                  status={step === 0 && !uploading ? "error" : "process"}
                  items={[
                    { title: "Chuẩn bị" },
                    { title: "Lấy URL" },
                    { title: "Upload" },
                    { title: "Hoàn tất" },
                  ]}
                />

                <Progress
                  style={{ marginTop: 20 }}
                  percent={Number(progress.toFixed(1))}
                  status={
                    step === 3 ? "success" : uploading ? "active" : "normal"
                  }
                  strokeColor={{ from: "#D4AF37", to: "#8B0000" }}
                />

                <Descriptions
                  size="small"
                  column={2}
                  style={{ marginTop: 12 }}
                  items={[
                    {
                      key: "size",
                      label: "Đã gửi",
                      children: `${formatBytes(uploadedSize)} / ${file ? formatBytes(file.size) : "-"}`,
                    },
                    {
                      key: "speed",
                      label: "Tốc độ",
                      children: speed > 0 ? `${speed.toFixed(2)} MB/s` : "-",
                    },
                  ]}
                />

                {statusText && (
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {statusText}
                  </Text>
                )}
              </Card>
            )}

            {done && (
              <Card style={{ marginTop: 24 }}>
                <Result
                  status="success"
                  title="Phát hành thành công"
                  subTitle={
                    <Space direction="vertical" size={4}>
                      <Text>
                        {config.label} · version{" "}
                        <Text strong>{versionSlug}</Text>
                        {isLinux && <Text> · {linuxFormat}</Text>}
                        <Text> · build {done.buildNumber}</Text>
                      </Text>
                      <Text code>{done.fileName}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        đã ghi vào game_versions (id {done.versionId.slice(0, 8)})
                      </Text>
                    </Space>
                  }
                  extra={
                    <Space wrap>
                      <Button
                        icon={<CopyOutlined />}
                        onClick={() => copyValue(done.fileName, "tên file")}
                      >
                        Copy tên file
                      </Button>

                      {publicUrl && (
                        <Button
                          type="primary"
                          icon={<LinkOutlined />}
                          href={publicUrl}
                          target="_blank"
                        >
                          Mở link tải
                        </Button>
                      )}

                      <Button
                        onClick={() => {
                          setFile(null);
                          resetUploadState();
                        }}
                      >
                        Upload bản khác
                      </Button>
                    </Space>
                  }
                />

                {publicUrl && (
                  <Alert
                    type="info"
                    showIcon
                    icon={<LinkOutlined />}
                    message="Link tải công khai"
                    description={
                      <Space direction="vertical" size={4}>
                        <Text copyable>{publicUrl}</Text>
                        <Text type="secondary">
                          Bucket <Text code>{B2_BUCKET_NAME}</Text> đã bật
                          quyền đọc công khai trên B2.
                        </Text>
                      </Space>
                    }
                  />
                )}
              </Card>
            )}
          </Col>

          {/* ---------------------------------------- Cột phải: preview & danh sách */}
          <Col xs={24} lg={9}>
            <Card title="Key sẽ upload">
              <Descriptions
                column={1}
                size="small"
                items={[
                  {
                    key: "version",
                    label: "Version",
                    children:
                      !manualKey && versionSlug ? (
                        <Tag color="#2E8B57">{versionSlug}</Tag>
                      ) : (
                        <Text type="secondary">
                          {manualKey ? "tự đặt key" : "chưa nhập"}
                        </Text>
                      ),
                  },
                  {
                    key: "os",
                    label: "Nền tảng",
                    children: (
                      <Space size={6}>
                        {config.icon}
                        {config.label}
                        {isLinux && (
                          <Tag style={{ marginInlineEnd: 0 }}>
                            {linuxFormat}
                          </Tag>
                        )}
                      </Space>
                    ),
                  },
                  {
                    key: "fileName",
                    label: "Tên file (B2 key)",
                    children: fileName ? (
                      <Text code copyable>
                        {fileName}
                      </Text>
                    ) : (
                      <Text type="secondary">—</Text>
                    ),
                  },
                ]}
              />

              <Divider style={{ margin: "12px 0" }} />

              <Space direction="vertical" size={8} style={{ width: "100%" }}>
                {manualKey ? (
                  <Text type="secondary">
                    Đang tự đặt key — bỏ qua quy ước đặt tên.
                  </Text>
                ) : (
                  <Text type="secondary">
                    Mẫu:{" "}
                    <Text code>game_su_quan_[version].{config.extension}</Text>
                  </Text>
                )}

                <Text type="secondary" style={{ fontSize: 12 }}>
                  {fileName
                    ? `→ ${fileName}`
                    : manualKey
                      ? "→ nhập key ở cột trái"
                      : "→ game_su_quan_1.0.0" + config.extension}
                </Text>
              </Space>
            </Card>

            <Card
              style={{ marginTop: 24 }}
              title={`File release trên B2 (${releaseFiles.length})`}
              extra={
                <Button
                  type="link"
                  size="small"
                  icon={<ReloadOutlined />}
                  loading={loadingFiles}
                  onClick={loadReleaseFiles}
                >
                  Làm mới
                </Button>
              }
            >
              {releaseFiles.length === 0 ? (
                <Text type="secondary">
                  Bấm “Làm mới” để tải danh sách từ bucket.
                </Text>
              ) : (
                <List
                  itemLayout="horizontal"
                  split={false}
                  loading={loadingFiles}
                  dataSource={releaseFiles}
                  pagination={
                    releaseFiles.length > 8
                      ? {
                          pageSize: 8,
                          size: "small",
                          align: "center",
                        }
                      : false
                  }
                  renderItem={renderReleaseItem}
                />
              )}
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
