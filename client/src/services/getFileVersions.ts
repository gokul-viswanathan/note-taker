import getBaseURL from "@/utils/baseURL"
import { getGithubConfig } from "@/utils/storage"
import { FileVersionEntry } from "@/types/version"

const normalizeResponse = (payload: unknown): FileVersionEntry[] => {
  if (Array.isArray(payload)) {
    return payload as FileVersionEntry[]
  }

  if (
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as { versions?: FileVersionEntry[] }).versions)
  ) {
    return (payload as { versions: FileVersionEntry[] }).versions
  }

  return []
}

const fetchFileVersions = async (path: string): Promise<FileVersionEntry[]> => {
  const baseURL = getBaseURL()
  const githubConfig = getGithubConfig()

  if (!githubConfig?.username || !githubConfig?.repo || !githubConfig?.token) {
    throw new Error("Missing GitHub configuration")
  }

  const { username, repo, token } = githubConfig
  const subpath = path.split("/").map(encodeURIComponent).join("/")
  const url = `${baseURL}/v1/fileversions?username=${username}&repo=${repo}&subpath=${subpath}`

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return normalizeResponse(data)
  } catch (error) {
    console.error("Failed to fetch file versions:", error)
    throw error
  }
}

export default fetchFileVersions
