import React from "react";

interface PopupContainerProps {
  children: React.ReactElement;
  onPopupOverlayClick?: () => void;
}

export function PopupContainer(props: PopupContainerProps) {
  return (
    <div
      className="fixed inset-0 z-20 overflow-y-auto w-screen h-screen bg-nh-popoup-overlay
     flex justify-center items-center"
      onClick={props.onPopupOverlayClick}
    >
      {React.cloneElement(props.children, {
        onClick: (e: React.ChangeEvent) => {
          e.stopPropagation();
          return e;
        },
      })}
    </div>
  );
}
