// theme/themeConfig.ts
import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
    token: {
        fontSize: 16,
        colorPrimary: '#8B0000', // imperialRed
        colorSuccess: '#2E8B57', // success
        colorWarning: '#FF8C00', // warning
        colorError: '#DC143C', // danger
        colorInfo: '#1E90FF', // info

        // Màu nền
        colorBgBase: '#F5F5DC', // ivory
        colorBgContainer: '#FFFFFF',
        colorBgElevated: '#F1E8D6', // parchment

        // Màu chữ
        colorTextBase: '#000000',
        colorTextSecondary: '#8B4513', // nobleBrown
        colorTextTertiary: '#003366', // royalNavy

        // Border
        colorBorder: '#D4AF37', // imperialGold
        colorBorderSecondary: '#CD7F32', // bronze

        // Border radius
        borderRadius: 8,

        // Font
        fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    components: {
          Checkbox: {
      // Màu chính cho checkbox
      colorPrimary: '#8B4513', // nobleBrown - màu nâu đỏ chủ đạo
      colorPrimaryHover: '#A0522D', // nâu đỏ đậm hơn khi hover
      colorPrimaryBorder: '#CD7F32', // bronze - border color

      // Màu khi được chọn
      colorWhite: '#FFFFFF',
      colorBgContainer: '#FFFFFF',
      colorBgContainerDisabled: '#F5F5DC', // ivory

      // Kích thước và border
      borderRadius: 4,
      borderRadiusSM: 2,
      colorBorder: '#CD7F32', // bronze

      // Kích thước
      controlInteractiveSize: 16,
      fontSize: 14,
      fontSizeSM: 12,

      // Padding và margin
      paddingXS: 8,
      marginXS: 8,

      // Line width
      lineWidth: 2,
      lineWidthBold: 3,
    },

        // Button styling
        Button: {
            colorPrimary: '#8B0000', // imperialRed
            colorPrimaryHover: '#A52A2A',
            colorPrimaryActive: '#660000',
            primaryShadow: '0 2px 0 rgba(139, 0, 0, 0.1)',
            defaultShadow: '0 2px 0 rgba(212, 175, 55, 0.1)',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
        },

        // Layout styling
        Layout: {
            bodyBg: '#F5F5DC', // ivory
            headerBg: '#8B0000', // imperialRed
            siderBg: '#003366', // royalNavy
            triggerBg: '#D4AF37', // imperialGold
            triggerColor: '#8B0000', // imperialRed
        },

        // Menu styling
        Menu: {
            darkItemBg: '#003366', // royalNavy
            darkItemSelectedBg: '#8B0000', // imperialRed
            darkItemHoverBg: '#004080',
            itemSelectedBg: '#F1E8D6', // parchment
            itemHoverBg: '#F5F5DC', // ivory
            itemActiveBg: '#D4AF37', // imperialGold
        },

        // Card styling
        Card: {
            colorBgContainer: '#FFFFFF',
            colorBorderSecondary: '#F1E8D6', // parchment
            boxShadowTertiary: '0 4px 12px rgba(139, 69, 19, 0.1)',
            borderRadius: 12,
        },

        // Table styling
        Table: {
            headerBg: '#003366', // royalNavy
            headerColor: '#FFFFFF',
            rowHoverBg: '#F1E8D6', // parchment
            borderColor: '#D4AF37', // imperialGold
        },

        // Input styling
        Input: {
            colorBorder: '#CD7F32', // bronze
            hoverBorderColor: '#D4AF37', // imperialGold
            activeBorderColor: '#8B0000', // imperialRed
            activeShadow: '0 0 0 2px rgba(139, 0, 0, 0.1)',
        },

        // Statistic styling
        Statistic: {
            titleFontSize: 14,
            contentFontSize: 24,
        },
        Tabs: {
            // Màu chữ tab item
            itemColor: '#8B4513', // nobleBrown
            itemHoverColor: '#8B0000', // imperialRed
            itemSelectedColor: '#8B0000', // imperialRed
            itemActiveColor: '#8B0000', // imperialRed

            // Màu nền tabs
            cardBg: '#F1E8D6', // parchment

            // Màu border và indicator
            inkBarColor: '#D4AF37', // imperialGold - màu indicator
            colorBorderSecondary: '#CD7F32', // bronze - border color

            // Kích thước và khoảng cách
            horizontalItemPadding: '16px 24px',
            horizontalItemGutter: 8,

            // Font chữ
            fontFamily: '"Cinzel", "Times New Roman", serif', // Font cổ điển cho game
            fontWeightStrong: 600,
            titleFontSize: 14,

            // Border radius
            borderRadius: 8,
            borderRadiusLG: 12,

            // Shadow effects
            boxShadow: '0 2px 8px rgba(139, 69, 19, 0.1)',
            boxShadowSecondary: '0 4px 16px rgba(139, 69, 19, 0.15)',

            // Transition
            motionDurationSlow: '0.3s',
            motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
    },
};

export default theme;
