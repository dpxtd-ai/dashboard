export interface Repository {
  id: string;
  name: string;
  visibility: 'Private' | 'Public';
  icon: 'cloud' | 'shield' | 'activity' | 'terminal' | 'cpu' | 'database' | 'lock' | 'share2';
  description: string;
  primaryBranch: string;
  updatedAt: string;
  url: string;
  liveUrl: string;
  techStack: string[];
  pipelineStatus: 'passing' | 'running' | 'failed';
  commitsCount: number;
  openPRs: number;
}

export interface VelocityDay {
  day: string;
  date: string;
  commits: number;
  current?: boolean;
}

export interface CommitAuthor {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface ChangedFile {
  name: string;
  additions: number;
  deletions: number;
  status: 'modified' | 'added' | 'deleted';
}

export interface LatestCommit {
  hash: string;
  fullHash: string;
  message: string;
  branch: string;
  syncMethod: string;
  timeAgo: string;
  timestamp: string;
  author: CommitAuthor;
  stats: {
    additions: number;
    deletions: number;
    filesChanged: number;
  };
  changedFiles: ChangedFile[];
}

export interface DashboardStats {
  totalCommits: number;
  sprintCommits: number;
  sprintName: string;
  primaryBranch: string;
  velocityAvg: string;
  activePRs: number;
  activePipelines: number;
  passingPipelines: number;
  totalLinesAdded: number;
  totalLinesDeleted: number;
  filesChanged: number;
  dailyVelocity: VelocityDay[];
}

export interface KanbanCard {
  id: string;
  title: string;
  repo: string;
  prNumber?: number;
  assignee: string;
  avatar?: string;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  status: 'backlog' | 'in_progress' | 'review' | 'testing' | 'done';
}

export interface CIPipeline {
  id: string;
  title: string;
  repo: string;
  prNumber: number;
  author: string;
  branch: string;
  status: 'success' | 'running' | 'failed' | 'queued';
  testsCount: number;
  duration: string;
  updatedAt: string;
  pythonVersion: string;
}

export interface UrlEndpoint {
  id: string;
  title: string;
  repo: string;
  environment: 'Production' | 'Staging' | 'Webhook' | 'API Docs';
  url: string;
  status: '200 OK' | 'Degraded' | 'Deploying';
  latencyMs: number;
  lastChecked: string;
}
