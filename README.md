# Vue3 + TailwindCSS 弹窗提示框插件

A simple popup alert plugin for Vue3 and TailwindCSS

## 功能特性 | Features
- `showToast`: 轻量级提示框 | Lightweight toast notification
- `showModal`: 模态对话框 | Modal dialog box
- `showLoading`: 加载状态提示 | Loading state indicator
- `hideLoading`: 关闭加载状态 | Hide loading state

## 使用方法 | Usage

### style.css
```
@import "tailwindcss";

/* 自定义动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1.2s linear infinite;
}

```

### import { seaAlert } from '@/plugins/seaAlert';

### showToast

**参数 | Parameters:**
- `icon`: "success" | "error" | "loading" | "none"

```javascript
function showToast() {
     seaAlert.showToast({ 
        title: 'showToast',
        // icon: 'none',
        // icon: 'error',
        // icon: 'loading',
        // icon: 'success',
    });
}
```

### showModal

**参数 | Parameters:**
- `title`: string
- `content`: string
- `showCancel`: boolean
- `cancelText`: string
- `cancelColor`: string
- `confirmText`: string
- `confirmColor`: string
- `mask`: boolean

```javascript
function showModal() {
seaAlert.showModal({
    content: 'showModal',
    // showCancel: false,
    // success: (res) => {
    //     if (res.confirm) {
    //         console.log('用户点击了确定');
    //         // 执行确定操作 | Execute confirm action
    //     } else {
    //         console.log('用户点击了取消');
    //     }
    // }
    });
}
```

### showLoading & hideLoading

**showLoading 参数 | Parameters:**
- `title`: string
- `mask`: boolean

```javascript
function showLoading() {
seaAlert.showLoading({ title: '加载中...'});

setTimeout(() => {
    seaAlert.hideLoading();
}, 2000);
}
```

## 依赖 | Dependencies
- Vue 3
- TailwindCSS
