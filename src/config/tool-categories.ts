export interface ToolCategory {
  name: string
  icon: string
  tools: {
    title: string
    path: string
    icon?: string
  }[]
}

// 手动维护工具分类，按需添加/修改即可
export const toolCategories: ToolCategory[] = [
  {
    name: '设计工具',
    icon: 'mdi-pencil-ruler-outline',
    tools: [
      { title: '颜色选择与转换', path: '/tools/color-picker', icon: 'mdi-palette-outline' },
    ],
  },
  {
    name: '开发工具',
    icon: 'mdi-code-braces',
    tools: [
      { title: '时间戳转换', path: '/tools/timestamp', icon: 'mdi-clock-outline' },
      { title: '图片格式转换', path: '/tools/image-convert', icon: 'mdi-image-outline' },
    ],
  },
]
