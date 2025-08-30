import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

export default function MyPage() {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto">
        <section className="bg-white border-2 border-yellow-400 rounded-2xl shadow-sm p-6 md:p-8">
          <h2 className="font-semibold text-xl">내 프로필</h2>

          <div className="mt-6 space-y-6">
            <div className="flex items-center">
              <div className="w-28 text-sm font-semibold">이미지</div>
              <div className="flex w-full justify-between items-center">
                <Avatar className="w-16 h-16 rounded-full border">
                  <AvatarImage src="https://github.com/shadcn.png" />
                </Avatar>
                <Button>설정</Button>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-28 text-sm font-semibold">닉네임</div>

              <div className="flex w-full justify-between items-center">
                <span className="text-sm font-medium">테스트닉네임</span>
                <Button>설정</Button>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-28 text-sm font-semibold">이메일</div>
              <div className="flex w-full justify-between items-center">
                <span className="text-sm font-medium underline">
                  test123@naver.com
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-28 text-sm font-semibold">비밀번호</div>
              <div className="flex w-full justify-between items-center">
                <span className="tracking-widest select-none text-sm">
                  ****************
                </span>
                <Button>설정</Button>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end mr-2 mt-20">
          <Button>회원 탈퇴</Button>
        </div>
      </div>
    </div>
  );
}
