import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  noindex?: boolean;
}

const defaultImage = "/images/og-image.jpg";
const siteName = "OmniCortex AI Labs";
const siteUrl = "https://omnicortex.ai";
const twitterHandle = "@OmniCortexAI";

export function SEO({
  title,
  description,
  keywords = "Artificial Intelligence, Machine Learning, Deep Learning, Neural Networks, Multimodal AI, LLM, NLP, Computer Vision, AI Research, AI Models",
  image = defaultImage,
  url = siteUrl,
  type = "website",
  author = "OmniCortex AI Labs",
  publishedTime,
  modifiedTime,
  section,
  twitterCard = "summary_large_image",
  noindex = false,
}: SEOProps) {
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;
  const fullImageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;
  const fullUrl = url.startsWith("http") ? url : `${siteUrl}${url}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:locale" content="en_US" />

      {/* Article specific (for blog posts) */}
      {type === "article" && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          <meta property="article:author" content={author} />
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={title} />

      {/* Additional SEO */}
      <meta name="theme-color" content="#0a0f1a" />
      <meta name="msapplication-TileColor" content="#0a0f1a" />
      
      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": siteName,
          "url": siteUrl,
          "logo": `${siteUrl}/images/logo.png`,
          "description": "Pioneering the future of Artificial Intelligence with advanced Multimodal AI systems, Deep Learning, and Neural Networks.",
          "sameAs": [
            "https://twitter.com/OmniCortexAI",
            "https://github.com/OmniCortex-AI",
            "https://linkedin.com/company/omnicortex-ai-labs",
            "https://huggingface.co/OmniCortex"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "contact@omnicortex.ai"
          }
        })}
      </script>
    </Helmet>
  );
}

// Pre-configured SEO for common pages
export const PageSEO = {
  Home: () => (
    <SEO
      title="OmniCortex AI Labs | Advanced Multimodal Artificial Intelligence Research"
      description="Pioneering the future of Artificial Intelligence with advanced Multimodal AI systems, Deep Learning, and Neural Networks that think, learn, and adapt. Explore our open-source models and cutting-edge research."
      keywords="Artificial Intelligence, Multimodal AI, Deep Learning, Neural Networks, LLM, NLP, Computer Vision, AI Research, Machine Learning, Generative AI, AI Safety, Edge AI"
      url="/"
    />
  ),
  
  About: () => (
    <SEO
      title="About Us"
      description="Learn about OmniCortex AI Labs - our mission to democratize AI, our world-class research team, and our commitment to building safe, beneficial artificial intelligence for humanity."
      keywords="About OmniCortex, AI Research Lab, AI Team, AI Mission, Artificial Intelligence Company, AI Safety, Beneficial AI"
      url="/about"
    />
  ),
  
  Research: () => (
    <SEO
      title="Research & Publications"
      description="Explore groundbreaking AI research from OmniCortex Labs. Our publications cover multimodal learning, efficient fine-tuning, AI safety, and neural architecture search."
      keywords="AI Research, Machine Learning Papers, Deep Learning Publications, Multimodal AI Research, AI Safety Research, Neural Architecture Search"
      url="/research"
      type="website"
    />
  ),
  
  Models: () => (
    <SEO
      title="Models & Datasets"
      description="Access open-source AI models and high-quality datasets from OmniCortex. Download OmniCortex-7B, OmniVision-Pro, CodeCortex-34B and more on Hugging Face."
      keywords="AI Models, Open Source AI, Hugging Face Models, LLM Models, Vision Models, Code Models, AI Datasets, Machine Learning Datasets"
      url="/models"
    />
  ),
  
  Pricing: () => (
    <SEO
      title="Pricing & Plans"
      description="Choose the perfect OmniCortex AI plan for your needs. From Starter to Enterprise, get access to powerful AI models, API credits, and premium support."
      keywords="AI Pricing, AI API Plans, Machine Learning API, AI Subscription, Enterprise AI, AI Credits"
      url="/pricing"
      type="product"
    />
  ),
  
  Playground: () => (
    <SEO
      title="AI Playground"
      description="Try OmniCortex AI models for free. Test our chat, code generation, and image analysis capabilities directly in your browser before subscribing."
      keywords="AI Playground, Try AI Free, AI Demo, Chat AI, Code Generation, Image Analysis AI"
      url="/playground"
    />
  ),
  
  Dashboard: () => (
    <SEO
      title="Dashboard"
      description="Manage your OmniCortex AI account, monitor API usage, and access your subscription details."
      url="/dashboard"
      noindex={true}
    />
  ),
  
  Billing: () => (
    <SEO
      title="Billing & Subscription"
      description="Manage your OmniCortex AI subscription, view invoices, and update payment methods."
      url="/billing"
      noindex={true}
    />
  ),
  
  ApiKeys: () => (
    <SEO
      title="API Keys"
      description="Create and manage your OmniCortex AI API keys for secure access to our models and services."
      url="/api-keys"
      noindex={true}
    />
  ),
};

export default SEO;
