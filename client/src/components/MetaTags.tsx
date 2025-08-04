import { useEffect } from "react";

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  keywords?: string;
  canonical?: string;
  publishedTime?: string | null;
  modifiedTime?: string | null;
  section?: string;
  author?: string;
}

export default function MetaTags({
  title = "Incluser - доступный сайт о доступности",
  description = "Личный блог о цифровой доступности и инклюзивном дизайне",
  image = "/favicon.png",
  url = window.location.href,
  type = "website",
  siteName = "Incluser",
  keywords,
  canonical,
  publishedTime,
  modifiedTime,
  section,
  author
}: MetaTagsProps) {
  
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let tag = document.querySelector(selector) as HTMLMetaElement;
      
      if (!tag) {
        tag = document.createElement('meta');
        if (isProperty) {
          tag.setAttribute('property', property);
        } else {
          tag.setAttribute('name', property);
        }
        document.head.appendChild(tag);
      }
      
      tag.setAttribute('content', content);
    };

    // Update basic meta tags
    updateMetaTag('description', description);
    
    // Keywords meta tag
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }
    
    // Update Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image.startsWith('http') ? image : `${window.location.origin}${image}`, true);
    updateMetaTag('og:url', canonical || url, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', siteName, true);
    updateMetaTag('og:locale', 'ru_RU', true);
    
    // Article specific Open Graph tags
    if (type === 'article') {
      if (publishedTime) {
        updateMetaTag('article:published_time', new Date(publishedTime).toISOString(), true);
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', new Date(modifiedTime).toISOString(), true);
      }
      if (section) {
        updateMetaTag('article:section', section, true);
      }
      if (author) {
        updateMetaTag('article:author', author, true);
      }
    }
    
    // Update Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', image.startsWith('http') ? image : `${window.location.origin}${image}`, true);
    
    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical || url);

  }, [title, description, image, url, type, siteName, keywords, canonical, publishedTime, modifiedTime, section, author]);

  return null; // This component doesn't render anything visible
}