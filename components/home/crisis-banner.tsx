export default function CrisisBanner({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <aside
      id="crisis-banner"
      className="mt-8 rounded-xl border-2 border-[#ffd59e]/40 bg-[#2a1a0e] p-6 sm:p-8"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl shrink-0" aria-hidden="true">
          &#x1F9E1;
        </span>
        <div>
          <h3 className="font-serif text-[1.35rem] font-semibold mb-2 text-[#ffd59e]">
            You are not alone, and you matter deeply.
          </h3>
          <p className="mb-4 text-[0.95rem] text-[#e8d5c0] leading-relaxed">
            We hear you. If you or someone you know is in crisis or having
            thoughts of self-harm, please reach out to one of these free,
            confidential resources:
          </p>
          <ul className="list-none m-0 mb-4 p-0 grid gap-3">
            <li className="flex items-center gap-3 rounded-lg bg-[#3a2515] px-4 py-3">
              <span className="text-xl" aria-hidden="true">&#x1F4DE;</span>
              <div>
                <strong className="text-[#ffd59e] text-[0.95rem]">
                  988 Suicide &amp; Crisis Lifeline
                </strong>
                <span className="block text-[0.88rem] text-[#e8d5c0]">
                  Call or text <strong>988</strong> &mdash; available 24/7
                </span>
              </div>
            </li>
            <li className="flex items-center gap-3 rounded-lg bg-[#3a2515] px-4 py-3">
              <span className="text-xl" aria-hidden="true">&#x1F4AC;</span>
              <div>
                <strong className="text-[#ffd59e] text-[0.95rem]">
                  Crisis Text Line
                </strong>
                <span className="block text-[0.88rem] text-[#e8d5c0]">
                  Text <strong>HOME</strong> to <strong>741741</strong>
                </span>
              </div>
            </li>
            <li className="flex items-center gap-3 rounded-lg bg-[#3a2515] px-4 py-3">
              <span className="text-xl" aria-hidden="true">&#x1F6A8;</span>
              <div>
                <strong className="text-[#ffd59e] text-[0.95rem]">
                  Emergency Services
                </strong>
                <span className="block text-[0.88rem] text-[#e8d5c0]">
                  Call <strong>911</strong> if you are in immediate danger
                </span>
              </div>
            </li>
          </ul>
          <p className="text-[0.82rem] text-[#b8a090] leading-relaxed">
            This tool provides Scripture-based encouragement and is not a
            substitute for professional mental health care. A trained
            counselor can provide the support you deserve.
          </p>
        </div>
      </div>
    </aside>
  );
}
