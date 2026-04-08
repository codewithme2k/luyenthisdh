/* eslint-disable @next/next/no-img-element */
import type { Author } from "contentlayer/generated";
import type { ReactNode } from "react";

import { SITE_METADATA } from "@/shared/site-metadata";
import { Container } from "@/components/customs/Container";
import { ProfileCard } from "@/components/customs/cards/profile";
import { Twemoji } from "@/components/customs/twemoji";
import { SocialAccounts } from "@/components/customs/author/social-accounts";

interface Props {
  children?: ReactNode;
  content: Omit<Author, "_id" | "_raw" | "body">;
}

export function AuthorLayout({ children }: Props) {
  return (
    <Container className="pt-4 lg:pt-12">
      <div className="py-8 md:grid md:grid-cols-3 gap-12">
        {/* Cột trái: Profile Card */}
        <div className="pr-4">
          <ProfileCard />
        </div>

        {/* Cột phải: Nội dung chính */}
        <div className="md:col-span-2 md:pl-4 xl:pl-8">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section>
              <h2 className="mt-0 flex items-center gap-3">
                Xin chào <Twemoji emoji="waving-hand" />
              </h2>
              <p>
                Chào mừng bạn đến với blog của tôi. Đây là nơi tôi chia sẻ những
                kiến thức, trải nghiệm và những điều thú vị mà mình học được
                trong hành trình làm nghề.
              </p>
            </section>

            <section className="mt-12">
              <h2>Ủng hộ (Donate)</h2>
              <p>
                Nếu bạn thấy những chia sẻ của tôi hữu ích, một tách cà phê sẽ
                là nguồn động lực tuyệt vời để tôi tiếp tục duy trì và phát
                triển nội dung cho blog.
              </p>

              {/* Khu vực Donate tối giản cho Việt Nam */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
                <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Twemoji emoji="bank" />
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      Chuyển khoản
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ngân hàng: <strong>MB Bank</strong>
                    <br />
                    Số tài khoản: <strong>[Số tài khoản của bạn]</strong>
                    <br />
                    Chủ TK: <strong>[Tên của bạn]</strong>
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Twemoji emoji="mobile-phone" />
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      Ví điện tử
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    MoMo: <strong>0967583134</strong>
                    <br />
                    Nội dung: <strong>Donate Blog</strong>
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-12">
              <h2>Liên hệ</h2>
              <p>
                Tôi luôn sẵn sàng kết nối và thảo luận về công nghệ:{" "}
                <a
                  href={`mailto:${SITE_METADATA.email}`}
                  className="text-primary-500 hover:text-primary-600 no-underline"
                >
                  {SITE_METADATA.email}
                </a>
              </p>
              <div className="mt-4">
                <SocialAccounts />
              </div>
            </section>

            {children && <div className="mt-12">{children}</div>}
          </div>
        </div>
      </div>
    </Container>
  );
}
