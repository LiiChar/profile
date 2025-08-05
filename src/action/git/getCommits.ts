export const getCommits = async () => {
    const res = await fetch('https://api.github.com/repos/LiiChar/book-styde/commits');
    return await res.json();
}