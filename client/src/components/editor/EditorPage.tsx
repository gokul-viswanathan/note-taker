"use client"
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import dynamic from "next/dynamic"
import { useStore } from "@/stores/states"
import AppSideBar from "@/components/shadcnSidebar/Sidebar"
import ThoughtInkHeader from "@/components/header/ThoughtInkHeader"
const AiSideBar = dynamic(() => import("@/components/aiSideBar"), {
  ssr: false,
})
import { FileItem } from "@/types/git-interface"
import { useTheme } from "@/components/theme/ThemeProvider"
import { useSidebar } from "@/components/ui/sidebar"
import fetchFileVersions from "@/services/getFileVersions"
import fetchFileContent from "@/services/getFileContent"
import FileVersionTimeline from "@/components/versioning/FileVersionTimeline"
import VersionPreviewOverlay from "@/components/versioning/VersionPreviewOverlay"
import {
  DiffSegment,
  FileVersionEntry,
  VersionPreviewMode,
} from "@/types/version"
import { parseContentToOps, opsToPlainText } from "@/utils/content"
import { diffLines } from "@/utils/diff"

const QuillEditor = dynamic(() => import("@/components/NewQuillEditor"), {
  ssr: false,
  loading: () => <div>Loading editor...</div>,
})

const MainComponent = () => {
  const currentFile = useStore((state) => state.currentFile)
  const currentFileContent = useStore((state) => state.currentFileContent)
  const { darkMode, toggleTheme } = useTheme()
  const { toggleSidebar, openMobile } = useSidebar()
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false)
  const [historyPanelOpen, setHistoryPanelOpen] = useState(false)
  const [versions, setVersions] = useState<FileVersionEntry[]>([])
  const [versionsLoading, setVersionsLoading] = useState(false)
  const [versionsError, setVersionsError] = useState<string | null>(null)
  const [selectedVersion, setSelectedVersion] =
    useState<FileVersionEntry | null>(null)
  const [previewMode, setPreviewMode] = useState<VersionPreviewMode>(null)
  const [previewText, setPreviewText] = useState("")
  const [previewLoading, setPreviewLoading] = useState(false)
  const [diffSegments, setDiffSegments] = useState<DiffSegment[]>([])

  useEffect(() => {
    const savedFile = localStorage.getItem("currentFile")
    if (savedFile) {
      try {
        const parsedFile: FileItem = JSON.parse(savedFile)
        if (parsedFile) useStore.setState({ currentFile: parsedFile })
      } catch (error) {
        console.error("Failed to parse saved file from localStorage:", error)
        localStorage.removeItem("currentFile")
      }
    }
  }, [])

  useEffect(() => {
    if (currentFile) {
      localStorage.setItem("currentFile", JSON.stringify(currentFile))
    } else {
      localStorage.removeItem("currentFile")
    }
  }, [currentFile])

  const currentFilePath =
    typeof currentFile === "string" ? currentFile : currentFile?.path

  const currentFilePlainText = useMemo(
    () => opsToPlainText(currentFileContent),
    [currentFileContent],
  )

  const loadVersions = useCallback(async () => {
    if (!currentFilePath) {
      setVersions([])
      setVersionsError(null)
      return
    }

    setVersionsLoading(true)
    setVersionsError(null)
    try {
      const history = await fetchFileVersions(currentFilePath)
      setVersions(history)
    } catch (error) {
      console.error("Failed to load version history:", error)
      setVersionsError("Unable to load version history")
    } finally {
      setVersionsLoading(false)
    }
  }, [currentFilePath])

  useEffect(() => {
    if (historyPanelOpen) {
      loadVersions()
    }
  }, [historyPanelOpen, loadVersions])

  useEffect(() => {
    if (!historyPanelOpen) {
      setSelectedVersion(null)
      setPreviewText("")
      setPreviewMode(null)
      setDiffSegments([])
    }
  }, [historyPanelOpen])

  useEffect(() => {
    setSelectedVersion(null)
    setPreviewText("")
    setPreviewMode(null)
    setDiffSegments([])
  }, [currentFilePath])

  function handlePushToRepo() {
    useStore.getState().setSaveFile?.(true)
  }

  const handleToggleHistorySidebar = () => {
    setHistoryPanelOpen((prev) => !prev)
  }

  const handleViewVersion = async (version: FileVersionEntry) => {
    if (!currentFilePath) return
    setSelectedVersion(version)
    setPreviewMode("history")
    setPreviewLoading(true)
    setDiffSegments([])

    try {
      const data = await fetchFileContent(currentFilePath, version.sha)
      const ops = parseContentToOps(data?.content)
      setPreviewText(opsToPlainText(ops))
    } catch (error) {
      console.error("Failed to fetch version content:", error)
      setPreviewText("")
    } finally {
      setPreviewLoading(false)
    }
  }

  const handleClosePreview = () => {
    setSelectedVersion(null)
    setPreviewMode(null)
    setPreviewText("")
    setDiffSegments([])
  }

  const handleShowDiff = () => {
    if (!selectedVersion) return
    setPreviewMode("diff")
    setDiffSegments(diffLines(previewText, currentFilePlainText))
  }

  const handleExitDiff = () => {
    setPreviewMode("history")
  }

  return (
    <div className="notepad-page h-screen w-full flex flex-col ">
      <ThoughtInkHeader
        currentFile={
          typeof currentFile === "string" ? currentFile : currentFile?.path
        }
        darkMode={darkMode}
        onToggleTheme={() => toggleTheme()}
        onPushToRepo={handlePushToRepo}
        onToggleFileSidebar={toggleSidebar}
        onToggleAISidebar={() => setAiSidebarOpen(!aiSidebarOpen)}
        onToggleHistorySidebar={handleToggleHistorySidebar}
      />
      <div className="flex flex-1 overflow-hidden">
        <AppSideBar />
        <div
          className={`editor relative flex-1 overflow-hidden ${openMobile ? "pointer-events-none opacity-50" : ""}`}
        >
          <QuillEditor />
          <VersionPreviewOverlay
            visible={Boolean(selectedVersion && previewMode)}
            mode={previewMode}
            version={selectedVersion}
            content={previewText}
            isLoading={previewLoading}
            onClose={handleClosePreview}
            onShowDiff={handleShowDiff}
            onExitDiff={handleExitDiff}
            diffSegments={diffSegments}
            canShowDiff={Boolean(previewText || currentFilePlainText)}
          />
        </div>
        <FileVersionTimeline
          open={historyPanelOpen}
          versions={versions}
          loading={versionsLoading}
          error={versionsError}
          onRefresh={loadVersions}
          onClose={() => setHistoryPanelOpen(false)}
          onViewVersion={handleViewVersion}
          selectedVersion={selectedVersion}
          currentFilePath={currentFilePath}
        />
        <AiSideBar open={aiSidebarOpen} onOpenChange={setAiSidebarOpen} />
      </div>
    </div>
  )
}

export default MainComponent
