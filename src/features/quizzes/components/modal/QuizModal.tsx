import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuizQuery } from "../../hooks/useQuizQuery";
import { useParams } from "react-router";
import { useMemo, useState } from "react";
import { type QuizChoiceArr, type QuizSolveResponse } from "../../types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { solveQuiz } from "../../api/api";
import { CheckIcon, XIcon } from "lucide-react";
import type { AxiosError } from "axios";
import { useSession } from "@/features/auth/context/useSession";

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

export default function QuizModal({ isOpen, onClose }: Props){
    const memberId = useSession();
    const {articleId} = useParams();
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
    const [finished, setFinished] = useState(false);
    const [currentResult, setCurrentResult] = useState<QuizSolveResponse | null>();

    if (!articleId) return <div>ArticleID Error</div>;
    
    const {
        isPending,
        data  = [],
        isError,
        error,
    } = useQuizQuery(+articleId);

    if (isError) {
        const ax = error as AxiosError<any>;
        const msg = ax.response?.data?.message ?? ax.message ?? "알 수 없는 오류";
        return <div className="text-red-500">{msg}</div>;
    }

    // 퀴즈 응답 question1~4 배열 형태로 가공
    const quizzes: QuizChoiceArr[] = useMemo(() => {
    const list = data ?? [];
    return list.map((q) => ({
        id: q.id, 
        description: q.description,
        choices: [q.question1, q.question2, q.question3, q.question4],
        }));
    }, [data]);

    const [idx, setIdx] = useState(0);
    const current = quizzes[idx];

    const goNext = () => {
        // 마지막이면 종료
        if (idx === quizzes.length - 1) {
            setFinished(true);
            setSelectedChoice(null);
            setCurrentResult(null);
            return;
        }
        // 다음 문제로
        setIdx((i) => i + 1);
        setSelectedChoice(null);
        setCurrentResult(null);
    };

    const solveMutation = useMutation({
        mutationFn: (choiceIdx: number) =>
        solveQuiz(
            {                  
                memberId: +memberId,                              
                memberAnswer: (choiceIdx + 1).toString() 
            },
            +articleId,                           
            current.id                           
            ),
        onSuccess: (result) => {
            setCurrentResult({
                answer: result.answer,
                explanation: result.explanation,
                status: result.status
            });
        },
        onError: () => {
        alert("퀴즈 제출 중 오류가 발생했습니다.");
        },
    });

    return(
        <>
        <Dialog open={isOpen} onOpenChange={(open) => {if (!open) onClose();}}>
                <DialogHeader>
                    <DialogTitle>Quiz</DialogTitle>
                    <DialogDescription>QUIZ</DialogDescription>
                </DialogHeader>
            <DialogContent>
                {isPending ? (
                    <div>로딩 중...</div>
                    ) : finished ? (
                        <div className="text-center mt-5 text-lg font-semibold">
                            🎉 모든 퀴즈를 다 푸셨습니다. 고생하셨어요!
                        </div>
                    ) : !current ? (
                    <div>퀴즈가 없습니다.</div>
                    ) : (
                    <div className="space-y-3 m-auto">
                        <div className="text-sm opacity-70">
                            {idx + 1} / {quizzes.length}
                        </div>
                        <div className="text-xl font-bold mb-3">
                            {current.description}
                        </div>

                        <div className="list-decimal space-y-2 break-words">
                            {current.choices.map((c, i) => (
                                <li 
                                    key={i}
                                    onClick={() => setSelectedChoice(i)}
                                    className={`border p-2 rounded shadow cursor-pointer 
                                    ${selectedChoice === i ? "border-yellow-500" : ""}`}
                                >
                                    {c}
                                </li>
                            ))}
                        </div>
                    </div>  
                )}
                {currentResult && (
                <>
                    {currentResult?.status === "정답" ? (
                    <div className="mt-3 flex items-center gap-2 rounded border border-green-200 bg-green-50 p-3 text-green-700">
                        <CheckIcon className="h-4 w-4" />
                        <span>정답입니다!</span>
                    </div>
                    ) : (
                    <div className="mt-3 flex items-center gap-2 rounded border border-red-200 bg-red-50 p-3 text-red-700">
                        <XIcon className="h-4 w-4" />
                        <span>오답입니다!</span>
                    </div>
                    )}

                    {currentResult?.status === "정답" && (
                    <div className="mt-3 rounded border border-gray-200 bg-gray-50 p-3 text-sm">
                        <div className="mb-1 font-semibold">해설</div>
                        <p className="whitespace-pre-wrap">{currentResult.explanation}</p>
                    </div>
                    )}
                </>
                )}
                <DialogFooter>
                    {!finished && (
                        <>
                            {!currentResult && (
                            <Button
                                onClick={() => {
                                if (selectedChoice == null) {
                                    alert("답을 선택해주세요!");
                                    return;
                                }
                                solveMutation.mutate(selectedChoice);
                                }}
                                disabled={solveMutation.isPending || !current}
                            > 제출
                            </Button>
                            )}

                            {currentResult && (
                            <Button onClick={goNext}>
                                다음 문제
                            </Button>
                            )}
                        </>
                        )}
                </DialogFooter>
            </DialogContent>

        </Dialog>
        </>
    )
}