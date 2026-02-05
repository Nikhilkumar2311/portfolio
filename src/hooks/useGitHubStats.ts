import { useState, useEffect } from 'react';

interface GitHubStats {
    publicRepos: number;
    followers: number;
    totalStars: number;
    loading: boolean;
    error: string | null;
}

/**
 * Hook to fetch GitHub user stats from public API
 * Rate limit: 60 requests/hour for unauthenticated requests
 */
export function useGitHubStats(username: string): GitHubStats {
    const [stats, setStats] = useState<GitHubStats>({
        publicRepos: 0,
        followers: 0,
        totalStars: 0,
        loading: true,
        error: null,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch user data
                const userResponse = await fetch(`https://api.github.com/users/${username}`);

                if (!userResponse.ok) {
                    throw new Error('Failed to fetch GitHub data');
                }

                const userData = await userResponse.json();

                // Fetch repos to count total stars
                const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
                const reposData = await reposResponse.json();

                const totalStars = Array.isArray(reposData)
                    ? reposData.reduce((sum: number, repo: { stargazers_count: number }) => sum + repo.stargazers_count, 0)
                    : 0;

                setStats({
                    publicRepos: userData.public_repos || 0,
                    followers: userData.followers || 0,
                    totalStars,
                    loading: false,
                    error: null,
                });
            } catch (err) {
                setStats(prev => ({
                    ...prev,
                    loading: false,
                    error: err instanceof Error ? err.message : 'Failed to fetch stats',
                }));
            }
        };

        fetchStats();
    }, [username]);

    return stats;
}
