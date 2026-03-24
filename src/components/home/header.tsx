"use client";

import { useState, useEffect } from "react";
import { Layout, Button, Space, Drawer, Typography } from "antd";
import { Menu, Crown, Play } from "lucide-react";
import Link from "next/link";

const { Header } = Layout;
const { Title } = Typography;

export default function ResponsiveHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <Header
                style={{
                    position: "fixed",
                    top: 0,
                    width: "100%",
                    zIndex: 1000,
                    background: isScrolled
                        ? "rgba(139, 0, 0, 0.95)"
                        : "transparent",
                    borderBottom: isScrolled ? `2px solid #D4AF37` : "none",
                    transition: "all 0.3s ease",
                    backdropFilter: "blur(10px)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        maxWidth: "1200px",
                        margin: "0 auto",
                        padding: "0 20px",
                    }}
                >
                    {/* Logo */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                        }}
                    >
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                background:
                                    "linear-gradient(135deg, #8B0000, #D4AF37)",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "2px solid #D4AF37",
                            }}
                        >
                            <Crown size={20} color="#FFFFFF" />
                        </div>
                        <Title
                            level={3}
                            style={{
                                margin: 0,
                                background:
                                    "linear-gradient(135deg, #D4AF37, #FFD700)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                fontWeight: "bold",
                            }}
                        >
                            12 SỨ QUÂN
                        </Title>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="nav-desktop">
                        <Space size="large" style={{ marginLeft: "auto" }}>
                            <Link className="nav-link" href="/introduction">
                                Giới Thiệu
                            </Link>
                            <Link className="nav-link" href="/characters">
                                Nhân Vật
                            </Link>
                            <Link className="nav-link" href="/gameplay">
                                Lối Chơi
                            </Link>
                            <Link className="nav-link" href="/download">
                                Tải Game
                            </Link>
                            <Button
                                type="primary"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #D4AF37, #FFD700)",
                                    border: "none",
                                    fontWeight: "bold",
                                    color: "#8B0000",
                                }}
                                icon={<Play size={16} />}
                                href="/download"
                            >
                                Chơi Ngay
                            </Button>
                        </Space>
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        className="nav-mobile-btn"
                        type="text"
                        onClick={() => setOpen(true)}
                        icon={<Menu size={28} color="#D4AF37" />}
                        style={{ display: "none" }}
                    />
                </div>
            </Header>

            {/* Drawer Mobile */}
            <Drawer
                title="12 SỨ QUÂN"
                placement="right"
                onClose={() => setOpen(false)}
                open={open}
                styles={{
                    header: {
                        background: "#2a0b0b",
                        borderBottom: "1px solid #D4AF37",
                        color: "#FFD700",
                    },
                    body: { background: "#2a0b0b" }
                }}
            >
                <div className="mobile-links">
                    <Link className="mobile-link" href="/introduction">
                        Giới Thiệu
                    </Link>
                    <Link className="mobile-link" href="/characters">
                        Nhân Vật
                    </Link>
                    <Link className="mobile-link" href="/gameplay">
                        Lối Chơi
                    </Link>
                    <Link className="mobile-link" href="/download">
                        Tải Game
                    </Link>

                    <Button
                        type="primary"
                        block
                        href="/download"
                        style={{
                            marginTop: 20,
                            background:
                                "linear-gradient(135deg, #D4AF37, #FFD700)",
                            border: "none",
                            color: "#8B0000",
                            height: "50px",
                            fontWeight: "bold",
                            fontSize: "18px",
                        }}
                    >
                        Chơi Ngay
                    </Button>
                </div>
            </Drawer>

            {/* Responsive CSS */}
            <style>{`
                /* Hide desktop menu on mobile */
                @media (max-width: 768px) {
                    .nav-desktop {
                        display: none;
                    }
                    .nav-mobile-btn {
                        display: block !important;
                    }
                }

                .nav-link {
                    color: #D4AF37;
                    font-weight: 600;
                    transition: 0.2s;
                }
                .nav-link:hover {
                    color: #FFD700;
                }

                .mobile-link {
                    display: block;
                    padding: 12px 0;
                    font-size: 1.2rem;
                    color: #FFD700;
                    font-weight: 600;
                }
            `}</style>
        </>
    );
}
