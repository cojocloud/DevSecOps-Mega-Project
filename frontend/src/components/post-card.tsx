import { useNavigate } from 'react-router-dom';
import Post from '@/types/post-type';
import formatPostTime from '@/utils/format-post-time';
import CategoryPill from '@/components/category-pill';
import { createSlug } from '@/utils/slug-generator';
import { TestProps } from '@/types/test-props';

export default function PostCard({ post, testId = 'postcard' }: { post: Post } & TestProps) {
  const navigate = useNavigate();
  const slug = createSlug(post.title);
  return (
    <div
      className={`active:scale-click group w-full md:w-1/2 lg:w-1/3 xl:w-1/4`}
      data-testid={testId}
    >
      <div
        className={`bg-light dark:bg-dark-card mb-4 cursor-pointer rounded-lg shadow-md ${'md:mt-4 md:mr-8'}`}
        onClick={() => navigate(`/details-page/${slug}/${post._id}`, { state: { post } })}
      >
        <div className="h-48 w-full overflow-hidden">
          <img
            src={post.imageLink}
            alt={post.title}
            className={`sm:group-hover:scale-hover h-full w-full rounded-t-lg object-cover transition-transform ease-in-out`}
          />
        </div>
        <div className="p-3">
          <div className="text-light-info dark:text-dark-info mb-1 text-xs">
            {post.authorName} • {formatPostTime(post.timeOfPost)}
          </div>
          <h2 className="text-light-title dark:text-dark-title mb-2 line-clamp-1 text-base font-semibold">
            {post.title}
          </h2>
          <p className="text-light-description dark:text-dark-description line-clamp-2 text-sm">
            {post.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.categories.map((category, index) => (
              <CategoryPill key={`${category}-${index}`} category={category} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
