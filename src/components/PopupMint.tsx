import React, { ReactNode, useMemo } from "react";
import { Drawer, Image, Modal } from "antd";
import { useWindowSize } from "../hooks/useWindownSize";
import { FailedIcon, SuccessIcon, MintingIcon } from "../icons";

export const PopupMint = ({
  status,
  isOpenPopup,
  linkPhoto,
  buttonAction,
  onClosePopup,
}: PopupMintProps) => {
  const { width } = useWindowSize();

  const { Icon, label, content } = useMemo(() => {
    switch (status) {
      case "connectWallet":
        return {
          Icon: FailedIcon,
          label: "Wallet not connected",
          content: "You need to connect your wallet first",
        };
      case "minting":
        return {
          Icon: MintingIcon,
          label: "Minting",
          content:
            "It normally takes 1 minutes to generate your cNFT. It’s safe to close this modal!",
        };
      case "mintSuccess":
        return {
          Icon: SuccessIcon,
          label: "Minted successful",
          content: "You can check it in your wallet",
        };
      case "mintFailed":
        return {
          Icon: FailedIcon,
          label: "Can’t mint right now",
          content:
            "You have encountered an issue during minting process, please try again.",
        };
      default:
        return { Icon: "", label: "", content: "" };
    }
  }, [status]);

  return (
    <div>
      {width >= 640 ? (
        <Modal
          title={
            <div className="flex items-center">
              <Icon />
              <div className="text-2xl font-bold ml-[10px]">{label}</div>
            </div>
          }
          open={isOpenPopup}
          width={508}
          footer={null}
          onCancel={onClosePopup}
        >
          <>
            <div className="flex h-10">
              <div className="font-medium font-normal">{content}</div>
            </div>
            {linkPhoto && (
              <div className="w-full flex items-center justifyContent-center px-[68px] mb-[20px]">
                <Image
                  className="w-full rounded-xl bg-cover"
                  src={linkPhoto}
                ></Image>
              </div>
            )}
            {buttonAction && (
              <div className="w-full flex items-center justify-center">
                {buttonAction}
              </div>
            )}
          </>
        </Modal>
      ) : (
        <Drawer
          title={
            <div className="flex items-center">
              <Icon />
              <div className="text-2xl font-bold ml-[10px]">{label}</div>
            </div>
          }
          className="rounded-t-3xl "
          placement={"bottom"}
          onClose={onClosePopup}
          open={isOpenPopup}
        >
          <div className="flex flex-col justifyContent-between">
            <div className="flex ">
              <div className="font-medium font-normal">{content}</div>
            </div>
            {linkPhoto && (
              <div className="w-full flex items-center justifyContent-center px-[68px] my-[25px]">
                <Image
                  className="w-full rounded-xl bg-cover"
                  src={linkPhoto}
                ></Image>
              </div>
            )}
            {buttonAction && (
              <div className="w-full flex items-center justify-center">
                {buttonAction}
              </div>
            )}
          </div>
        </Drawer>
      )}
    </div>
  );
};

interface PopupMintProps {
  status: string;
  isOpenPopup: boolean;
  linkPhoto?: string;
  buttonAction?: ReactNode;
  onClosePopup: () => void;
}
