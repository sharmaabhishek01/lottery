import {
  useConnectModal,
} from '@rainbow-me/rainbowkit';

const YourApp = ({classes}) => {
  const { openConnectModal } = useConnectModal();
  return (
    <>
      {openConnectModal && (
        <button onClick={openConnectModal} className={classes} type="button">
          Connect Now
        </button>
      )}
    </>
  );
};

export default YourApp