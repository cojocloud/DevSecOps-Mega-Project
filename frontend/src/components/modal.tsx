import React from 'react';
import { imageUrls } from '@/constants/images';
interface ModalProps {
  selectedImage: string;
  modal: boolean;
  handleImageSelect: (imageUrl: string) => void;
  handleSelector: () => void;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalComponent: React.FC<ModalProps> = ({
  selectedImage,
  handleImageSelect,
  handleSelector,
  setModal,
  modal,
}) => {
  return (
    <>
      {modal && (
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="false"
        >
          <div className="bg-opacity-75 fixed inset-0 bg-slate-800/50 transition-opacity"></div>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="bg-light relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-light dark:bg-dark px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:text-left">
                      <h3
                        className="text-light-primary dark:text-dark-primary text-base leading-6 font-semibold"
                        id="modal-title"
                      >
                        Choose a post cover image
                      </h3>
                      <div className="mt-2">
                        <div className="grid grid-cols-3 gap-4">
                          {imageUrls.map((imageUrl) => (
                            <div
                              key={imageUrl}
                              className={`aspect-square cursor-pointer overflow-clip border ${
                                selectedImage === imageUrl
                                  ? 'border-4 border-blue-300'
                                  : 'border-slate-300'
                              } rounded-md`}
                              onClick={() => handleImageSelect(imageUrl)}
                            >
                              <img
                                src={imageUrl}
                                alt={`Image ${imageUrl}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-light dark:bg-dark px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    name="imageLink"
                    className="active:scale-click bg-light-primary text-light hover:bg-light-secondary dark:bg-dark-primary dark:text-dark dark:hover:bg-dark-secondary inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:ml-3 sm:w-auto"
                    onClick={handleSelector}
                  >
                    Select
                  </button>
                  <button
                    type="button"
                    className="active:scale-click bg-light text-light-primary dark:bg-dark dark:text-dark-primary dark:hover:bg-dark-secondary/25 mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-slate-300 ring-inset hover:bg-slate-200 sm:mt-0 sm:w-auto"
                    onClick={() => {
                      setModal(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalComponent;
