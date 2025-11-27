import { h, render, type VNode } from "vue";

// 类型定义
export interface ToastOptions {
  title: string;
  icon?: "success" | "error" | "loading" | "none";
  image?: string;
  duration?: number;
  mask?: boolean;
  success?: () => void;
  fail?: () => void;
}

export interface ModalOptions {
  title?: string;
  content?: string;
  showCancel?: boolean;
  cancelText?: string;
  cancelColor?: string;
  confirmText?: string;
  confirmColor?: string;
  mask?: boolean;
  success?: (res: { confirm: boolean }) => void;
  fail?: () => void;
}

export interface LoadingOptions {
  title: string;
  mask?: boolean;
  success?: () => void;
  fail?: () => void;
}

// 创建容器 - 添加ID避免重复
const createContainer = (id: string) => {
  const containerId = id;
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.className =
      "fixed inset-0 flex items-center justify-center z-50 select-none";
    document.body.appendChild(container);
  }

  return container;
};

// 安全移除容器
const removeContainer = (container: HTMLElement) => {
  if (container && container.parentNode) {
    render(null, container);
    container.parentNode.removeChild(container);
  }
};

const MASK_CLASSES = {
  container: ["w-full", "h-full", "bg-black/50"],
  body: ["pointer-events-none", "select-none"],
} as const;

const updateMaskState = (mask: boolean, container: HTMLElement) => {
  const action = mask ? "add" : "remove";
  container.classList[action](...MASK_CLASSES.container);
  document.body.classList[action](...MASK_CLASSES.body);
};

// 图标组件
const Icon = (props: {
  type: "success" | "error" | "loading" | "none";
  image?: string;
}) => {
  if (props.image) {
    return h("img", {
      src: props.image,
      className: "w-12 h-12 object-contain",
      alt: "icon",
    });
  }

  const icons = {
    success: h(
      "svg",
      {
        viewBox: "0 0 256 256",
        fill: "#009d54",
        xmlns: "http://www.w3.org/2000/svg",
      },
      h("path", {
        d: "M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z",
      })
    ),
    error: h(
      "svg",
      {
        viewBox: "0 0 256 256",
        fill: "#f71616",
        xmlns: "http://www.w3.org/2000/svg",
      },
      h("path", {
        d: "M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z",
      })
    ),
    loading: h(
      "div",
      { className: "w-14 h-14 flex items-center justify-center animate-spin" }, //loading icon size w-14 h-14
      [
        h(
          "svg",
          {
            viewBox: "0 0 256 256",
            fill: "#ffffff",
            xmlns: "http://www.w3.org/2000/svg",
          },
          h("path", {
            d: "M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm37.25,58.75a8,8,0,0,0,5.66-2.35l22.63-22.62a8,8,0,0,0-11.32-11.32L167.6,77.09a8,8,0,0,0,5.65,13.66ZM224,120H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z",
          })
        ),
      ]
    ),
    none: null,
  };

  return icons[props.type] || null;
};

// Toast 实现
const Toast = (options: ToastOptions) => {
  const {
    title,
    icon = "none",
    image,
    duration = 1500,
    success,
    fail,
  } = options;

  const container = createContainer("sea-toast-container");

  const isIconNone = icon === "none";
  const titleWrapperClass = `text-center text-sm ${isIconNone ? "" : "mt-3"}`;
  const containerClass =
    "bg-black/70 text-white rounded-lg px-4 py-3 max-w-[80%] flex flex-col items-center";

  const vnode: VNode = h(
    "div",
    { className: containerClass },
    [
      // 仅当icon存在时渲染图标节点
      !isIconNone &&
        h("div", { className: "w-12 h-12" }, [h(Icon, { type: icon, image })]),
      h("div", { className: titleWrapperClass }, title),
    ].filter(Boolean) // 过滤空值
  );

  render(vnode, container);

  const timer = setTimeout(() => {
    removeContainer(container);
    success?.();
  }, duration);

  return {
    close: () => {
      clearTimeout(timer);
      removeContainer(container);
      fail?.();
    },
  };
};

// Modal 实现
const Modal = (options: ModalOptions) => {
  const {
    title = "提示",
    content = "showModal",
    showCancel = true,
    cancelText = "取消",
    cancelColor = "#4b5563",
    confirmText = "确定",
    confirmColor = "#2563eb",
    mask = true,
    success,
    fail,
  } = options;

  const container = createContainer("sea-modal-container");

  if (mask) {
    container.classList.add(...MASK_CLASSES.container);
  }

  const onConfirm = () => {
    removeContainer(container);
    success?.({ confirm: true });
  };

  const onCancel = () => {
    removeContainer(container);
    success?.({ confirm: false });
  };

  const vnode: VNode = h(
    "div",
    {
      className: "bg-white rounded-lg w-[80%] max-w-[300px] shadow-lg",
    },
    [
      title &&
        h(
          "div",
          {
            className:
              "py-3 tracking-wider text-xl border-b flex justify-center border-gray-200 font-black",
          },
          title
        ),
      h("div", { className: "px-4 py-4 text-lg text-gray-600" }, content),
      h(
        "div",
        {
          className: `w-full flex border-t border-gray-200 font-medium" ${
            showCancel ? "justify-between" : "justify-center"
          }`,
        },
        [
          showCancel &&
            h(
              "button",
              {
                className:
                  "rounded-lg py-2 text-lg tracking-wider w-36 h-12 hover:bg-gray-200 font-semibold",
                style: { color: cancelColor },
                onClick: onCancel,
              },
              cancelText
            ),
          h(
            "button",
            {
              className: `rounded-lg py-2 text-lg tracking-wider h-12 hover:bg-sky-100 font-semibold ${
                showCancel ? "w-36" : "w-full"
              }`,
              style: { color: confirmColor },
              onClick: onConfirm,
            },
            confirmText
          ),
        ]
      ),
    ]
  );

  render(vnode, container);

  return {
    close: () => {
      removeContainer(container);
      fail?.();
    },
  };
};

// Loading 实现
let loadingInstance: { close: () => void; container: HTMLElement } | null =
  null;

const Loading = (options: LoadingOptions) => {
  // 关闭已存在的loading
  if (loadingInstance) {
    try {
      loadingInstance.close();
    } catch (e) {
      console.error("Failed to close existing loading instance:", e);
    }
  }

  const {
    title,
    mask = true, // Loading默认应该有遮罩
    success,
    fail,
  } = options;

  const container = createContainer("sea-loading-container");
  updateMaskState(mask, container);

  const vnode: VNode = h(
    "div",
    {
      className:
        "bg-black/70 text-white rounded-lg px-6 py-4 flex flex-col items-center",
    },
    [
      h(Icon, { type: "loading" }),
      h("div", { className: "mt-2 text-lg tracking-wider" }, title),
    ]
  );

  render(vnode, container);

  const close = () => {
    removeContainer(container);
    document.body.classList.remove(...MASK_CLASSES.body);
    loadingInstance = null;
    success?.();
  };

  loadingInstance = { close, container };

  return {
    close: () => {
      try {
        close();
      } catch (e) {
        console.error("Failed to close loading:", e);
        loadingInstance = null;
        fail?.();
      }
    },
  };
};

// 对外暴露的 API
export const seaAlert = {
  showToast: (options: ToastOptions) => Toast(options),
  showModal: (options: ModalOptions) => Modal(options),
  showLoading: (options: LoadingOptions) => Loading(options),
  hideLoading: () => {
    if (loadingInstance) {
      loadingInstance.close();
    }
  },
};
