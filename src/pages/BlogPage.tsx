import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogArticles } from '../data/blogArticles';
import { Logo } from '../components/Logo';
import { ArrowLeft, Clock, Tag } from 'lucide-react';

export function BlogPage() {
  useEffect(() => {
    document.title = 'Blog - AI Testing Insights & Guides | Feedquire';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Read expert guides on AI testing, earning money as an AI tester, and maximizing your Feedquire income. Learn tips, strategies, and insights from the leading AI testing platform.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Logo />
            <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Feedquire Blog</h1>
          <p className="text-xl text-gray-600">Insights, guides, and tips for AI testers</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogArticles.map((article) => (
            <Link
              key={article.slug}
              to={`/blog/${article.slug}`}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {article.readTime}
                  </span>
                  <span>{article.publishDate}</span>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {article.title}
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.metaDescription}
                </p>

                <div className="flex flex-wrap gap-2">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-900 hover:text-gray-700">
                  Read article →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
