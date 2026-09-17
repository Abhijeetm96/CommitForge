import React from 'react';
import {
  BookOpen,
  Terminal,
  GitBranch,
  Share2,
  Globe,
  Users,
  GitMerge,
  CheckCircle2,
  Layers,
  LayoutGrid,
  Zap,
  Bookmark,
  Cpu,
  FolderGit2,
  FolderPlus,
  FolderTree,
  PlayCircle,
  ShieldAlert,
  ShieldCheck,
  Shield,
  Command,
  Sparkles,
  AlertCircle,
  FileCode,
  FileCheck,
  FileX,
  Eye,
  PlusCircle,
  GitCommit,
  GitCompare,
  RotateCcw,
  ArrowLeftRight,
  CornerDownRight,
  Anchor,
  Server,
  Upload,
  Download,
  ArrowDownCircle,
  GitFork,
  GitPullRequest,
  Key,
  Lock,
  RefreshCw,
  Workflow,
  Sliders,
  Boxes,
  MessageSquare,
  MessageCircle,
  CircleDot,
  Target,
  Archive,
  Crosshair,
  Undo2,
  History,
  Tag,
  Send,
  Activity,
  Package,
  Clock,
  Search,
  Database,
  Code,
  Monitor,
  Compass,
} from 'lucide-react';

/**
 * Returns the matching Lucide icon for a given concept ID or command.
 */
export function getConceptIcon(
  conceptId?: string,
  command?: string,
  size = 16,
  color?: string
): React.ReactElement {
  const iconProps = { size, ...(color ? { color } : {}) };

  if (conceptId) {
    switch (conceptId) {
      case 'c-what-is-vcs': return <Compass {...iconProps} />;
      case 'c-why-use-vcs': return <Shield {...iconProps} />;
      case 'c-git-vs-other-vcs': return <GitFork {...iconProps} />;
      case 'c-installing-git-locally': return <Download {...iconProps} />;
      case 'c-what-is-a-repository': return <FolderGit2 {...iconProps} />;
      case 'c-git-init': return <Sparkles {...iconProps} />;
      case 'c-git-status': return <Eye {...iconProps} />;
      case 'c-git-add': return <PlusCircle {...iconProps} />;
      case 'c-git-commit': return <GitCommit {...iconProps} />;
      case 'c-git-diff': return <GitCompare {...iconProps} />;
      case 'c-git-restore-staged': return <RotateCcw {...iconProps} />;
      case 'c-git-branch': return <GitBranch {...iconProps} />;
      case 'c-git-switch': return <ArrowLeftRight {...iconProps} />;
      case 'c-git-checkout': return <CornerDownRight {...iconProps} />;
      case 'c-git-merge-basic': return <GitMerge {...iconProps} />;
      case 'c-three-way-merge': return <GitMerge {...iconProps} />;
      case 'c-fast-forward': return <GitMerge {...iconProps} />;
      case 'c-detached-head': return <Anchor {...iconProps} />;
      case 'c-git-remote': return <Server {...iconProps} />;
      case 'c-git-push': return <Upload {...iconProps} />;
      case 'c-git-fetch': return <Download {...iconProps} />;
      case 'c-git-pull': return <ArrowDownCircle {...iconProps} />;
      case 'c-git-clone': return <FolderPlus {...iconProps} />;
      case 'c-github-intro': return <Globe {...iconProps} />;
      case 'c-github-forks': return <GitFork {...iconProps} />;
      case 'c-github-pull-requests': return <GitPullRequest {...iconProps} />;
      case 'c-github-ssh-keys': return <Key {...iconProps} />;
      case 'c-gh-code-review': return <FileCheck {...iconProps} />;
      case 'c-gh-upstream-sync': return <RefreshCw {...iconProps} />;
      case 'c-gh-pr-squash': return <Layers {...iconProps} />;
      case 'c-gh-protected-branches': return <ShieldCheck {...iconProps} />;
      case 'c-git-rebase': return <Workflow {...iconProps} />;
      case 'c-git-rebase-i': return <Sliders {...iconProps} />;
      case 'c-merge-conflicts': return <AlertCircle {...iconProps} />;
      case 'c-atomic-commits': return <Boxes {...iconProps} />;
      case 'c-commit-messages': return <MessageSquare {...iconProps} />;
      case 'c-gitignore-mastery': return <FileX {...iconProps} />;
      case 'c-clean-git-hygiene': return <Sparkles {...iconProps} />;
      case 'c-trunk-based': return <GitBranch {...iconProps} />;
      case 'c-gitflow': return <Layers {...iconProps} />;
      case 'c-team-conflict-prevention': return <Users {...iconProps} />;
      case 'c-gh-issues': return <CircleDot {...iconProps} />;
      case 'c-gh-project-boards': return <LayoutGrid {...iconProps} />;
      case 'c-gh-milestones': return <Target {...iconProps} />;
      case 'c-git-stash': return <Archive {...iconProps} />;
      case 'c-git-cherry-pick': return <Crosshair {...iconProps} />;
      case 'c-git-reset-modes': return <Undo2 {...iconProps} />;
      case 'c-git-revert': return <History {...iconProps} />;
      case 'c-lightweight-tags': return <Tag {...iconProps} />;
      case 'c-annotated-tags': return <Bookmark {...iconProps} />;
      case 'c-pushing-tags': return <Send {...iconProps} />;
      case 'c-client-hooks': return <Zap {...iconProps} />;
      case 'c-commit-msg-hook': return <FileCode {...iconProps} />;
      case 'c-husky-lint-staged': return <Cpu {...iconProps} />;
      case 'c-submodule-add': return <FolderPlus {...iconProps} />;
      case 'c-submodule-update': return <RefreshCw {...iconProps} />;
      case 'c-submodules-vs-monorepo': return <FolderTree {...iconProps} />;
      case 'c-actions-intro': return <PlayCircle {...iconProps} />;
      case 'c-ci-cd-pipelines': return <Activity {...iconProps} />;
      case 'c-action-secrets': return <Lock {...iconProps} />;
      case 'c-releases-artifacts': return <Package {...iconProps} />;
      case 'c-git-reflog': return <Clock {...iconProps} />;
      case 'c-git-bisect': return <Search {...iconProps} />;
      case 'c-git-worktree': return <Layers {...iconProps} />;
      case 'c-git-internals-dag': return <Database {...iconProps} />;
      case 'c-gh-cli': return <Terminal {...iconProps} />;
      case 'c-gh-api': return <Code {...iconProps} />;
      case 'c-codespaces': return <Monitor {...iconProps} />;
      case 'c-gh-discussions': return <MessageCircle {...iconProps} />;
      case 'c-gh-pages': return <Globe {...iconProps} />;
      case 'c-gh-security': return <ShieldAlert {...iconProps} />;
    }
  }

  if (command) {
    const cLower = command.toLowerCase();
    if (cLower.includes('commit')) return <GitCommit {...iconProps} />;
    if (cLower.includes('branch')) return <GitBranch {...iconProps} />;
    if (cLower.includes('merge')) return <GitMerge {...iconProps} />;
    if (cLower.includes('pull request') || cLower.includes('pr')) return <GitPullRequest {...iconProps} />;
    if (cLower.includes('diff')) return <GitCompare {...iconProps} />;
    if (cLower.includes('status')) return <Eye {...iconProps} />;
    if (cLower.includes('add')) return <PlusCircle {...iconProps} />;
    if (cLower.includes('restore') || cLower.includes('reset')) return <RotateCcw {...iconProps} />;
    if (cLower.includes('rebase')) return <Workflow {...iconProps} />;
    if (cLower.includes('stash')) return <Archive {...iconProps} />;
    if (cLower.includes('tag')) return <Tag {...iconProps} />;
    if (cLower.includes('push')) return <Upload {...iconProps} />;
    if (cLower.includes('pull')) return <ArrowDownCircle {...iconProps} />;
    if (cLower.includes('fetch')) return <Download {...iconProps} />;
    if (cLower.includes('clone')) return <FolderPlus {...iconProps} />;
    if (cLower.includes('remote')) return <Server {...iconProps} />;
    if (cLower.includes('switch')) return <ArrowLeftRight {...iconProps} />;
    if (cLower.includes('checkout')) return <CornerDownRight {...iconProps} />;
    if (cLower.includes('init')) return <Sparkles {...iconProps} />;
    if (cLower.includes('bisect')) return <Search {...iconProps} />;
    if (cLower.includes('log') || cLower.includes('reflog')) return <Clock {...iconProps} />;
  }

  return <BookOpen {...iconProps} />;
}

/**
 * Returns the matching Lucide icon for an Academy Topic.
 */
export function getTopicIcon(
  iconName?: string,
  size = 16,
  color?: string
): React.ReactElement {
  const iconProps = { size, ...(color ? { color } : {}) };

  switch (iconName) {
    case 'BookOpen': return <BookOpen {...iconProps} />;
    case 'Terminal': return <Terminal {...iconProps} />;
    case 'GitBranch': return <GitBranch {...iconProps} />;
    case 'Share2': return <Share2 {...iconProps} />;
    case 'Globe': return <Globe {...iconProps} />;
    case 'Users': return <Users {...iconProps} />;
    case 'GitMerge': return <GitMerge {...iconProps} />;
    case 'CheckCircle2': return <CheckCircle2 {...iconProps} />;
    case 'Layers': return <Layers {...iconProps} />;
    case 'LayoutGrid': return <LayoutGrid {...iconProps} />;
    case 'Zap': return <Zap {...iconProps} />;
    case 'Bookmark': return <Bookmark {...iconProps} />;
    case 'Cpu': return <Cpu {...iconProps} />;
    case 'FolderGit2': return <FolderGit2 {...iconProps} />;
    case 'PlayCircle': return <PlayCircle {...iconProps} />;
    case 'ShieldAlert': return <ShieldAlert {...iconProps} />;
    case 'Command': return <Command {...iconProps} />;
    case 'Sparkles': return <Sparkles {...iconProps} />;
    default: return <BookOpen {...iconProps} />;
  }
}
