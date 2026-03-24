"use client"
// pages/landing-page.tsx
import React, { useState, useEffect } from 'react';
import {
    Layout,
    Button,
    Card,
    Row,
    Col,
    Statistic,
    Tag,
    Avatar,
    Divider,
    Typography,
    Space,
    Badge,
    Progress
} from 'antd';
import {
    Crown,
    Sword,
    Trophy,
    Users,
    Star,
    Play,
    Download,
    Share2,
    Castle,
} from 'lucide-react';
import Link from 'next/link';
import { GameLink } from '@/enums/Links';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import HeroSection from '@/components/home/hero';
import ResponsiveHeader from '@/components/home/header';
import FeaturesSection from '@/components/home/FeaturesSection';
import CharactersSection from '@/components/home/CharactersSection';
import CTASection from '@/components/home/CTASection';
import GameFooter from '@/components/home/GameFooter';

const { Title, Paragraph, Text } = Typography;
const { Header, Footer } = Layout;

const LandingPage = () => {
    return (
        <Layout style={{ background: 'linear-gradient(135deg, #F5F5DC 0%, #F1E8D6 100%)', minHeight: '100vh' }}>
            {/* Navigation Header */}
            <ResponsiveHeader />
            {/* Hero Section */}
            <HeroSection />
            <FeaturesSection />
            {/* Characters Section */}
            <CharactersSection />
            {/* CTA Section */}
            <CTASection/> 

            {/* Footer */}
        <GameFooter/>
        </Layout>
    );
};

export default LandingPage;
