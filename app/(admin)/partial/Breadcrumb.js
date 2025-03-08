"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

// Route mappings for automatic breadcrumb generation
const ROUTE_MAPPINGS = {
  "/": "Home",
  "/dashboard": "Dashboard", 
  "/users": "User List",
  "/users/create": "Create User",
};

// Dynamic segment indicators - these are segments that should keep their ID
const DYNAMIC_SEGMENTS = ["edit", "show", "details"];

/**
 * Smart Breadcrumb Component
 */
export default function Breadcrumb({
  items,
  className = "",
}) {
  const pathname = usePathname();
  
  // Generate breadcrumb items based on current path or provided items
  const breadcrumbItems = useMemo(() => {
    // If items are provided, use them
    if (items && items.length > 0) {
      return [...items];
    }
    
    // Otherwise generate from current path
    const result = [];
    
    if (pathname) {
      // Split path into segments
      const segments = pathname.split('/').filter(Boolean);
      
      
      // Build paths and handle dynamic segments
      let currentPath = "";
      
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        currentPath += `/${segment}`;
        
        // Check if this segment is a dynamic segment (like 'edit')
        const isDynamicSegment = DYNAMIC_SEGMENTS.includes(segment);
        
        // Check if there's a next segment that could be an ID
        const nextSegment = i + 1 < segments.length ? segments[i + 1] : null;
        const hasIdAfterDynamic = isDynamicSegment && nextSegment && /^\d+$/.test(nextSegment);
        
        if (isDynamicSegment && hasIdAfterDynamic) {
          // This is a dynamic segment followed by an ID
          // For cases like /users/edit/1
          
          // 1. Find the parent resource path (e.g., /users)
          const parentPath = currentPath.split('/').slice(0, -1).join('/');
          
          // 2. Add the parent resource breadcrumb if it exists and isn't already added
          if (parentPath && !result.some(item => item.href === parentPath)) {
            const parentLabel = ROUTE_MAPPINGS[parentPath] || 
                              formatLabel(parentPath.split('/').pop());
            
            result.push({
              label: parentLabel,
              href: parentPath
            });
          }
          
          // 3. Format label for the action (edit, view, etc.)
          const actionLabel = formatLabel(segment);
          
          // 4. Add the action with the FULL path including ID
          const fullPath = `${currentPath}/${nextSegment}`;
          
          result.push({
            label: ROUTE_MAPPINGS[currentPath] || actionLabel,
            href: fullPath // Keep the ID in the path
          });
          
          // 5. Add the ID as the final segment
          result.push({
            label: nextSegment,
            href: fullPath
          });
          
          // Skip the next segment (ID) since we've already processed it
          i++;
          currentPath = fullPath;
        } else if (ROUTE_MAPPINGS[currentPath]) {
          // Standard mapped route
          result.push({
            label: ROUTE_MAPPINGS[currentPath],
            href: currentPath
          });
        } else {
          // Unmapped route - format the segment
          result.push({
            label: formatLabel(segment),
            href: currentPath
          });
        }
      }
      
      // Remove href from the last item (current page)
      if (result.length > 0) {
        const lastItem = { ...result[result.length - 1] };
        delete lastItem.href;
        result[result.length - 1] = lastItem;
      }
    }
    
    return result;
  }, [pathname, items]);
  
  if (breadcrumbItems.length === 0) return null;
  
  return (
    <nav className={`flex items-center flex-wrap justify-between font-14 mb-4 2xl:mb-6 ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon className="flex-shrink-0 size-4 text-gray-400 mx-1" aria-hidden="true" />
              )}
              
              {isLast || !item.href ? (
                <span className="text-gray-700 font-medium" aria-current="page">
                  {index === 0 ? (
                    <span className="flex items-center">
                      <HomeIcon className="size-4 2xl:size-5 mr-1" />
                      <span>{item.label}</span>
                    </span>
                  ) : (
                    item.label
                  )}
                </span>
              ) : (
                <Link 
                  href={item.href} 
                  className="text-gray-500 hover:text-gray-700 flex items-center"
                >
                  {index === 0 ? (
                    <span className="flex items-center">
                      <HomeIcon className="size-4 2xl:size-5 mr-1" />
                      <span>{item.label}</span>
                    </span>
                  ) : (
                    item.label
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

        {/* back button */}
      {breadcrumbItems.length > 1 && (
        <Link 
          href={(() => {
            const path = pathname || "";
                        if (DYNAMIC_SEGMENTS.some(segment => path.includes(`/${segment}/`))) {
              const segments = path.split('/');
              const dynamicSegmentIndex = segments.findIndex(seg => 
                DYNAMIC_SEGMENTS.includes(seg)
              );
              
              if (dynamicSegmentIndex > 0) {
                return segments.slice(0, dynamicSegmentIndex).join('/');
              }
            }
            
            return breadcrumbItems[breadcrumbItems.length - 2]?.href || "/";
          })()}
          className="border border-gray-200 hover:bg-gray-200 px-2 pr-1 py-0.5 rounded-md text-gray-500 hover:text-gray-700 flex items-center"
        >
          <span className="font-medium">Back</span>
          <ChevronRightIcon className="flex-shrink-0 size-4 text-gray-400 ml-2" aria-hidden="true" />
        </Link>
      )}

    </nav>
  );
}

function formatLabel(text) {
  return text
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}