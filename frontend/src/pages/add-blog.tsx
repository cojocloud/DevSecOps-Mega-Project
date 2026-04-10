import axios from 'axios';
import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import navigateBackBlackIcon from '@/assets/svg/navigate-back-black.svg';
import navigateBackWhiteIcon from '@/assets/svg/navigate-back-white.svg';
import ModalComponent from '@/components/modal';
import CategoryPill from '@/components/category-pill';
import { categories } from '@/utils/category-colors';

type FormData = {
  title: string;
  authorName: string;
  imageLink: string;
  categories: string[];
  description: string;
  isFeaturedPost: boolean;
};
function AddBlog() {
  const [selectedImage, setSelectedImage] = useState<string>('');

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const [modal, setmodal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    authorName: '',
    imageLink: '',
    categories: [],
    description: '',
    isFeaturedPost: false,
  });

  //checks the length of the categories array and if the category is already selected
  const isValidCategory = (category: string): boolean => {
    return formData.categories.length >= 3 && !formData.categories.includes(category);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryClick = (category: string) => {
    if (isValidCategory(category)) return;

    if (formData.categories.includes(category)) {
      setFormData({
        ...formData,
        categories: formData.categories.filter((cat) => cat !== category),
      });
    } else {
      setFormData({
        ...formData,
        categories: [...formData.categories, category],
      });
    }
  };

  const handleselector = () => {
    setFormData({
      ...formData,
      imageLink: selectedImage,
    });
    setmodal(false);
  };
  const handleCheckboxChange = () => {
    setFormData({ ...formData, isFeaturedPost: !formData.isFeaturedPost });
  };
  const validateFormData = () => {
    if (
      !formData.title ||
      !formData.authorName ||
      !formData.imageLink ||
      !formData.description ||
      formData.categories.length === 0
    ) {
      toast.error('All fields must be filled out.');
      return false;
    }
    const imageLinkRegex = /\.(jpg|jpeg|png|webp)$/i;
    if (!imageLinkRegex.test(formData.imageLink)) {
      toast.error('Image URL must end with .jpg, .jpeg, .webp or .png');
      return false;
    }
    if (formData.categories.length > 3) {
      toast.error('Select up to three categories.');
      return false;
    }

    return true;
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateFormData()) {
      try {
        const response = await axios.post(import.meta.env.VITE_API_PATH + '/api/posts/', formData);

        if (response.status === 200) {
          toast.success('Blog post successfully created!');
          navigate('/');
        } else {
          toast.error('Error: ' + response.data.message);
        }
      } catch (err: any) {
        toast.error('Error: ' + err.message);
      }
    }
  };
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    setIsDarkMode(storedTheme === 'dark');
  }, []);

  function Asterisk() {
    return <span className="dark:text-dark-tertiary">*</span>;
  }

  return (
    <div className="dark:bg-dark flex-grow cursor-default bg-slate-50 px-6 py-8">
      <div className="mb-4 flex justify-center">
        <div className="flex w-[32rem] items-center justify-start space-x-4 md:w-5/6 lg:w-4/6">
          <div className="w-fit cursor-pointer">
            <img
              src={isDarkMode ? navigateBackWhiteIcon : navigateBackBlackIcon}
              onClick={() => navigate(-1)}
              className="active:scale-click h-5 w-10"
            />
          </div>
          <h2 className="text-light-primary dark:text-dark-primary cursor-text text-lg font-semibold md:text-xl lg:text-2xl">
            Create Blog
          </h2>
        </div>
      </div>
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="md:w-5/6 lg:w-2/3">
          <div className="mb-2 flex items-center">
            <label className="flex items-center">
              <span className="text-light-secondary dark:text-dark-secondary px-2 text-base font-medium">
                Is this a featured blog?
              </span>
              <input
                type="checkbox"
                name="isFeaturedPost"
                className="ml-2 h-5 w-5 cursor-pointer rounded-full accent-purple-400"
                checked={formData.isFeaturedPost}
                onChange={handleCheckboxChange}
              />
            </label>
          </div>

          <div className="mb-2">
            <div className="text-light-secondary dark:text-dark-secondary px-2 py-1 font-medium">
              Blog title <Asterisk />
            </div>
            <input
              type="text"
              name="title"
              placeholder="Travel Bucket List for this Year"
              autoComplete="off"
              className="placeholder:text-light-tertiary dark:bg-dark-card dark:placeholder:text-dark-tertiary w-full rounded-lg bg-slate-200 p-3 placeholder:text-sm dark:text-slate-50"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-1">
            <div className="text-light-secondary dark:text-dark-secondary px-2 py-1 font-medium">
              Blog content <Asterisk />
            </div>
            <textarea
              name="description"
              placeholder="Start writing here&hellip;"
              rows={5}
              className="placeholder:text-light-tertiary dark:bg-dark-card dark:placeholder:text-dark-tertiary w-full rounded-lg bg-slate-200 p-3 placeholder:text-sm dark:text-slate-50"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-2">
            <div className="text-light-secondary dark:text-dark-secondary px-2 py-1 font-medium">
              Author name <Asterisk />
            </div>
            <input
              type="text"
              name="authorName"
              placeholder="Shree Sharma"
              className="placeholder:text-light-tertiary dark:bg-dark-card dark:placeholder:text-dark-tertiary w-full rounded-lg bg-slate-200 p-3 placeholder:text-sm dark:text-slate-50"
              value={formData.authorName}
              onChange={handleInputChange}
            />
          </div>

          <div className="text-light-secondary dark:text-dark-secondary px-2 py-1 font-medium">
            Blog cover image
            <span className="text-dark-tertiary text-xs tracking-wide">
              &nbsp;(jpg/png/webp)&nbsp;
            </span>
            <Asterisk />
          </div>
          <div className="mb-4 flex justify-between gap-2 md:gap-4">
            <input
              type="url"
              id="imagelink"
              name="imageLink"
              placeholder="https://&hellip;"
              autoComplete="off"
              className="placeholder:text-light-tertiary dark:bg-dark-card dark:placeholder:text-dark-tertiary w-3/4 rounded-lg bg-slate-200 p-3 placeholder:text-sm lg:w-10/12 dark:text-slate-50"
              value={formData.imageLink}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="lg:text-md active:scale-click bg-light-primary hover:bg-light-primary/80 dark:bg-dark-primary dark:text-dark-card dark:hover:bg-dark-secondary/80 w-1/4 rounded-lg text-xs text-slate-50 md:text-sm lg:w-2/12 lg:px-4 lg:py-3"
              onClick={() => {
                setmodal(true);
              }}
            >
              Pick image
            </button>
          </div>
          <div className="mb-4 flex flex-col">
            <label className="text-light-secondary dark:text-dark-secondary px-2 pb-1 font-medium md:mr-4 md:w-fit">
              Categories
              <span className="text-dark-tertiary text-xs tracking-wide">
                &nbsp;(max 3 categories)&nbsp;
              </span>
              <Asterisk />
            </label>
            <div className="dark:bg-dark-card flex flex-wrap gap-3 rounded-lg p-2 dark:p-3">
              {categories.map((category, index) => (
                <span key={`${category}-${index}`} onClick={() => handleCategoryClick(category)}>
                  <CategoryPill
                    category={category}
                    selected={formData.categories.includes(category)}
                    disabled={isValidCategory(category)}
                  />
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="active:scale-click bg-light-primary text-light hover:bg-light-primary/80 dark:bg-dark-primary dark:text-dark-card dark:hover:bg-dark-secondary/80 flex w-full items-center justify-center rounded-lg px-12 py-3 text-base font-semibold md:mx-1 md:w-fit"
          >
            Post blog
          </button>
        </form>
        <ModalComponent
          selectedImage={selectedImage}
          handleImageSelect={handleImageSelect}
          handleSelector={handleselector}
          setModal={setmodal}
          modal={modal}
        />
      </div>
    </div>
  );
}

export default AddBlog;
