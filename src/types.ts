export interface Stat
{
    submitter: string;
    total: number;
    correctAnswers: number;
}

export interface StatsData {
    stats: Stat[];
}