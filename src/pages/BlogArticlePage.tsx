import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogArticles } from '../data/blogArticles';
import { Logo } from '../components/Logo';
import { ArrowLeft, Clock, Tag, Share2 } from 'lucide-react';

export function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const article = blogArticles.find(a => a.slug === slug);

  useEffect(() => {
    if (!article) {
      navigate('/blog');
      return;
    }

    document.title = `${article.title} | Feedquire Blog`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', article.metaDescription);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', article.keywords.join(', '));
    }
  }, [article, navigate]);

  if (!article) {
    return null;
  }

  const relatedArticles = blogArticles.filter(a => a.slug !== slug).slice(0, 2);

  const handleShare = (platform: string) => {
    const url = `https://www.feedquire.com/blog/${article.slug}`;
    const text = article.title;

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Logo />
            <Link to="/blog" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft size={20} />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg border border-gray-200 p-8 md:p-12">
          <div className="mb-8">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Clock size={16} />
                {article.readTime}
              </span>
              <span>{article.publishDate}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                >
                  <Tag size={14} />
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <Share2 size={16} />
                Share:
              </span>
              <button
                onClick={() => handleShare('twitter')}
                className="text-sm text-gray-600 hover:text-blue-500 transition"
              >
                Twitter
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="text-sm text-gray-600 hover:text-blue-700 transition"
              >
                LinkedIn
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="text-sm text-gray-600 hover:text-blue-600 transition"
              >
                Facebook
              </button>
            </div>
          </div>

          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
            style={{
              lineHeight: '1.8'
            }}
          />
          <style>{`
            .prose h2 {
              font-size: 1.75rem;
              font-weight: 700;
              color: #111827;
              margin-top: 2rem;
              margin-bottom: 1rem;
            }
            .prose h3 {
              font-size: 1.5rem;
              font-weight: 600;
              color: #111827;
              margin-top: 1.5rem;
              margin-bottom: 0.75rem;
            }
            .prose h4 {
              font-size: 1.25rem;
              font-weight: 600;
              color: #374151;
              margin-top: 1.25rem;
              margin-bottom: 0.5rem;
            }
            .prose p {
              margin-bottom: 1rem;
              color: #4b5563;
            }
            .prose ul, .prose ol {
              margin-left: 1.5rem;
              margin-bottom: 1rem;
            }
            .prose li {
              margin-bottom: 0.5rem;
              color: #4b5563;
            }
            .prose a {
              color: #2563eb;
              text-decoration: underline;
            }
            .prose a:hover {
              color: #1d4ed8;
            }
          `}</style>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
              >
                Visit Homepage
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition"
              >
                Sign Up Now
              </Link>
            </div>
          </div>
        </div>

        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  to={`/blog/${related.slug}`}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {related.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {related.metaDescription}
                  </p>
                  <span className="text-sm font-medium text-gray-900">
                    Read more →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
