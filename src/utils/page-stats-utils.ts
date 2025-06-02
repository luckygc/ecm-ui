import type { PageObject, PageManagerConfig } from "@/types/page-types";

/**
 * 页面统计信息接口
 */
export interface PageStats {
  total: number;
  visited: number;
  cached: number;
  maxCache: number;
  cacheUsageRate: number;
  visitedRate: number;
}

/**
 * 页面统计工具
 * 负责计算页面相关的统计信息
 */

/**
 * 计算基础页面统计信息
 */
export const computePageStats = (
  pages: Map<string, PageObject>,
  visitedPages: PageObject[],
  cachedPages: PageObject[],
  config: PageManagerConfig
): PageStats => {
  const total = pages.size;
  const visited = visitedPages.length;
  const cached = cachedPages.length;
  const maxCache = config.maxCacheSize;

  return {
    total,
    visited,
    cached,
    maxCache,
    cacheUsageRate: maxCache > 0 ? (cached / maxCache) * 100 : 0,
    visitedRate: total > 0 ? (visited / total) * 100 : 0,
  };
};

/**
 * 计算缓存统计信息
 */
export const computeCacheStats = (
  cachedPages: PageObject[],
  maxCacheSize: number
) => {
  const used = cachedPages.length;
  const available = Math.max(0, maxCacheSize - used);
  const usageRate = maxCacheSize > 0 ? (used / maxCacheSize) * 100 : 0;

  return {
    used,
    available,
    total: maxCacheSize,
    usageRate,
    isFull: used >= maxCacheSize,
    canAddMore: used < maxCacheSize,
  };
};

/**
 * 计算访问统计信息
 */
export const computeVisitStats = (
  pages: Map<string, PageObject>,
  visitedPages: PageObject[]
) => {
  const totalPages = pages.size;
  const visitedCount = visitedPages.length;
  const unvisitedCount = totalPages - visitedCount;
  const visitRate = totalPages > 0 ? (visitedCount / totalPages) * 100 : 0;

  // 按访问时间排序
  const sortedByVisit = [...visitedPages].sort(
    (a, b) => b.lastVisitedAt - a.lastVisitedAt
  );

  return {
    total: totalPages,
    visited: visitedCount,
    unvisited: unvisitedCount,
    visitRate,
    recentlyVisited: sortedByVisit.slice(0, 5), // 最近访问的5个页面
    oldestVisited: sortedByVisit.slice(-5), // 最早访问的5个页面
  };
};

/**
 * 计算多实例统计信息
 */
export const computeMultiInstanceStats = (pages: Map<string, PageObject>) => {
  const multiInstancePages = Array.from(pages.values()).filter(
    (page) => page.allowMultiple
  );

  const instanceGroups = new Map<string, PageObject[]>();
  
  multiInstancePages.forEach((page) => {
    const baseName = page.name;
    if (!instanceGroups.has(baseName)) {
      instanceGroups.set(baseName, []);
    }
    instanceGroups.get(baseName)!.push(page);
  });

  return {
    totalMultiInstancePages: multiInstancePages.length,
    uniqueMultiInstanceTypes: instanceGroups.size,
    instanceGroups: Object.fromEntries(instanceGroups),
    averageInstancesPerType: instanceGroups.size > 0 
      ? multiInstancePages.length / instanceGroups.size 
      : 0,
  };
};

/**
 * 页面统计工具对象
 */
export const pageStatsUtils = {
  computePageStats,
  computeCacheStats,
  computeVisitStats,
  computeMultiInstanceStats,
};
