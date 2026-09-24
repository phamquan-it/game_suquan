// lib/b2-classify.ts
//
// Phân loại file release trên B2 thành nền tảng + định dạng gói.
//
// Vì sao cần: key trên bucket KHÔNG theo một quy ước duy nhất. Hiện có hai
// quy ước song song, xem danh sách thật bên dưới. Suy nền tảng từ đuôi file là
// không đủ — đuôi file nói lên ĐỊNH DẠNG GÓI, không nói lên nền tảng hay
// distro:
//   game_12_suquan-arch-x86_64.pkg.tar.zst   ← "arch" quyết định distro
//   game_12_suquan-linux-x64.deb             ← ".deb" chỉ là định dạng
//
// Quy ước đang tồn tại trên bucket:
//   1. Mới (trang admin, thư mục gốc): game_su_quan_[version].[ext]
//      vd game_su_quan_1.0.1.apk
//   2. Cũ (thư mục releases/):         game_12_suquan-[os]-[arch].[ext]
//      vd releases/linux/game_12_suquan-linux-x64.deb
//
// Dùng if/else + String.includes() trên tên đã lowercase: dễ đọc, dễ thêm
// case mới, và không phụ thuộc thứ tự khớp đuôi như cách dùng mảng candidates
// sắp theo độ dài đuôi.
//
// KHÔNG phụ thuộc React/DOM → dùng được ở cả server lẫn client.

export type GameOS = "android" | "windows" | "linux" | "ios" | "macos";

/** Định dạng gói Linux, suy từ đuôi file. Chuỗi rỗng nếu không phải Linux. */
export type LinuxFormat =
  | "deb"
  | "rpm"
  | "tar.gz"
  | "tar.zst"
  | "pkg.tar.zst"
  | "appimage"
  | "";

export type FileClass = {
  os: GameOS | null;
  /** Chỉ có giá trị khi os === "linux". */
  linuxFormat: LinuxFormat;
  /** Nhãn hiển thị, vd "Linux · deb". null khi không nhận ra. */
  label: string | null;
};

const OS_LABEL: Record<GameOS, string> = {
  android: "Android",
  windows: "Windows",
  linux: "Linux",
  ios: "iOS",
  macos: "macOS",
};

/** Định dạng Linux, suy từ đuôi file. Khớp đuôi dài trước. */
function detectLinuxFormat(lower: string): LinuxFormat {
  if (lower.endsWith(".pkg.tar.zst")) return "pkg.tar.zst";
  if (lower.endsWith(".tar.zst")) return "tar.zst";
  if (lower.endsWith(".tar.gz") || lower.endsWith(".tgz")) return "tar.gz";
  if (lower.endsWith(".appimage")) return "appimage";
  if (lower.endsWith(".deb")) return "deb";
  if (lower.endsWith(".rpm")) return "rpm";
  return "";
}

/**
 * Suy nền tảng từ keyword trong tên file.
 *
 * Thứ tự nhánh QUAN TRỌNG: kiểm tra các keyword đặc thù trước keyword chung.
 * "game_su_quan_1.0.1.apk" không chứa "android" nhưng có ".apk"; còn
 * "game_12_suquan-arch-x86_64.pkg.tar.zst" không có "linux" mà có "arch".
 *
 * Lưu ý: "mac"/"osx" phải xét TRƯỚC "arch" — "...-arch-x86_64..." chứa cả
 * chuỗi con "arc", nên nếu xét mac trước bằng includes("mac") thì an toàn
 * (không có "mac" trong "arch"), nhưng xét "x86" chung sẽ bắt nhầm. Vì vậy
 * các nhánh dưới đây chỉ dùng keyword đủ đặc thù.
 */
export function classifyFile(fileName: string): FileClass {
  const lower = fileName.toLowerCase();

  // Android — kiểm tra trước vì ".apk" là đặc thù duy nhất.
  if (lower.includes(".apk") || lower.includes("android") || lower.includes("arm64-v8a")) {
    return { os: "android", linuxFormat: "", label: OS_LABEL.android };
  }

  // iOS — ".ipa" đặc thù; "ios" là chuỗi con của nhiều từ nên phải đứng sau
  // các nhánh đặc thù hơn.
  if (lower.includes(".ipa") || lower.includes("iphone") || lower.includes("ios")) {
    return { os: "ios", linuxFormat: "", label: OS_LABEL.ios };
  }

  // macOS — "darwin"/"osx"/"macos" đặc thù. Dùng "macos"/"osx"/"darwin",
  // KHÔNG dùng "mac" trần (bắt nhầm tên khác).
  if (lower.includes("macos") || lower.includes("darwin") || lower.includes("osx")) {
    return { os: "macos", linuxFormat: "", label: OS_LABEL.macos };
  }

  // Windows — ".zip" chỉ là zip chung nên phải kèm keyword windows.
  if (
    lower.includes("windows") ||
    lower.includes("win32") ||
    lower.includes("win64") ||
    lower.includes("win-x64") ||
    lower.includes("win-x86") ||
    lower.includes(".exe") ||
    lower.includes(".msi")
  ) {
    return { os: "windows", linuxFormat: "", label: OS_LABEL.windows };
  }

  // Linux — gồm cả các keyword distro. "arch" ở đây an toàn vì nhánh macos
  // đã xét trước và nhánh này chỉ chạy khi chưa khớp gì khác.
  const isLinux =
    lower.includes("linux") ||
    lower.includes("arch") ||
    lower.includes("debian") ||
    lower.includes("ubuntu") ||
    lower.includes("fedora") ||
    lower.includes("rhel") ||
    lower.includes("appimage") ||
    lower.includes("x86_64") ||
    lower.includes("amd64");

  if (isLinux) {
    const linuxFormat = detectLinuxFormat(lower);
    return {
      os: "linux",
      linuxFormat,
      label: linuxFormat ? `${OS_LABEL.linux} · ${linuxFormat}` : OS_LABEL.linux,
    };
  }

  // Không nhận ra — vd key do admin tự đặt không theo quy ước nào.
  // Trả null thay vì đoán bừa, để /download ẩn đi và trang admin cảnh báo.
  return { os: null, linuxFormat: "", label: null };
}

/** Tên nền tảng để hiển thị. */
export function osLabel(os: GameOS): string {
  return OS_LABEL[os];
}

export const ALL_OS: GameOS[] = ["windows", "linux", "android", "ios", "macos"];
