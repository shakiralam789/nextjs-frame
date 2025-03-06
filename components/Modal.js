import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

export default function Modal({
  children,
  show = false,
  closeable = true,
  title="",
  onClose = () => {},
}) {
  const close = () => {
    if (closeable) {
      onClose();
    }
  };

  return (
    <>
      <Dialog
        open={show}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="backdrop-blur-2xl fixed bg-black/80 inset-0 z-10 w-screen duration-300 linear overflow-y-auto data-[closed]:opacity-0">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white p-4 2xl:p-6"
            >
              <DialogTitle
                as="h3"
                className="font-18 font-medium text-black border-b border-gray-200 pb-2 mb-2"
              >
                {title}
              </DialogTitle>
              <div>{children}</div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
