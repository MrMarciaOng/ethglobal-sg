/**
 * v0 by Vercel.
 * @see https://v0.dev/t/FHyVa9MY4W2
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import EnhancedLoginModal from "./login-option";
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full px-4 lg:px-6 h-14 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link href="#" className="flex items-center justify-center">
            <EthereumIcon className="h-6 w-6" />
            <span className="text-lg font-semibold text-foreground ml-2">
              Safewire
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex gap-4 sm:gap-6">
              <Link
                href="#how-it-works"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                How It Works
              </Link>
              <Link
                href="#features"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Features
              </Link>
              <Link
                href="#benefits"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Benefits
              </Link>
              <Link
                href="#join-as-mod"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Join as a Mod
              </Link>
              <Link
                href="#faqs"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                FAQs
              </Link>
            </nav>
            {/* <Link
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-[#00b894] to-[#55efc4] px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-all duration-200 ease-in-out hover:from-[#00a785] hover:to-[#4de6b5] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"            >
              Launch App
            </Link> */}
            <EnhancedLoginModal buttonText="Launch DApp" />
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-[#00b894] to-[#55efc4]">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl text-primary-foreground">
                  Secure and Fair Decentralized Payments with Safewire
                </h1>
                <p className="max-w-[600px] text-emerald-100 md:text-xl">
                  Empower your transactions with Safewire's innovative payment
                  infrastructure. Experience secure payments with built-in
                  dispute resolution.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <EnhancedLoginModal
                    buttonText="Start Shopping"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-teal-600 px-8 text-sm font-medium text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:pointer-events-none disabled:opacity-50"
                  />
                  <EnhancedLoginModal
                    buttonText="Join as a Merchant"
                    className="bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  src="/safewire.png"
                  width={750}
                  height={550}
                  alt="Safewire - Secure and Fair Payments"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">
                How Safewire Works
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl">
                Safewire simplifies secure transactions with a built-in dispute
                resolution mechanism, ensuring peace of mind for both buyers and
                merchants.
              </p>
            </div>
            <div className="mx-auto grid items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <WalletIcon className="h-12 w-12 text-primary" />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">
                    Connect Your Wallet
                  </h3>
                  <p className="text-muted-foreground">
                    Securely connect your digital wallet to Safewire and get
                    started.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <TicketIcon className="h-12 w-12 text-primary" />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">
                    Make Payments
                  </h3>
                  <p className="text-muted-foreground">
                    Pay merchants securely. Funds are held for a short period to
                    allow for any disputes.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <ReceiptIcon className="h-12 w-12 text-primary" />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">
                    Receive Funds
                  </h3>
                  <p className="text-muted-foreground">
                    Merchants receive payments after the holding period,
                    ensuring secure and fair transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">
                Safewire Features
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl">
                Explore the innovative features that make Safewire the ideal
                solution for secure payments.
              </p>
            </div>
            <div className="mx-auto grid items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col items-start space-y-3">
                <LockIcon className="h-12 w-12 text-primary" />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">
                    Secure Payment Holding
                  </h3>
                  <p className="text-muted-foreground">
                    Payments are securely held for 3-7 days, providing a window
                    for dispute resolution if necessary.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start space-y-3">
                <InfoIcon className="h-12 w-12 text-primary" />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">
                    Decentralized Dispute Resolution
                  </h3>
                  <p className="text-muted-foreground">
                    A DAO consisting of staked moderators handles disputes,
                    ensuring fair and unbiased outcomes.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start space-y-3">
                <CheckIcon className="h-12 w-12 text-primary" />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">
                    Mod Incentives and Reputation System
                  </h3>
                  <p className="text-muted-foreground">
                    Moderators earn rewards and build reputation based on their
                    performance in dispute resolutions.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start space-y-3">
                <GlobeIcon className="h-12 w-12 text-primary" />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">
                    Global Accessibility
                  </h3>
                  <p className="text-muted-foreground">
                    Our decentralized platform is accessible to anyone, anywhere
                    in the world, with an internet connection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="benefits"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">
                Benefits of Safewire
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl">
                Discover how Safewire enhances your payment experience.
              </p>
            </div>
            <div className="mx-auto grid items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-start space-y-3">
                <DollarSignIcon className="h-12 w-12 text-primary" />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">
                    Low Fees
                  </h3>
                  <p className="text-muted-foreground">
                    Our platform offers transparent and low-cost transaction
                    fees, making payments more affordable.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start space-y-3">
                <CheckIcon className="h-12 w-12 text-primary" />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">
                    Fair Transactions
                  </h3>
                  <p className="text-muted-foreground">
                    Built-in dispute resolution ensures fairness and builds
                    trust between buyers and merchants.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start space-y-3">
                <LockIcon className="h-12 w-12 text-primary" />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">
                    Secure and Transparent
                  </h3>
                  <p className="text-muted-foreground">
                    Blockchain technology ensures all transactions are secure
                    and transparent.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start space-y-3">
                <DollarSignIcon className="h-12 w-12 text-primary" />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">
                    Earn as a Moderator
                  </h3>
                  <p className="text-muted-foreground">
                    Moderators earn rewards for resolving disputes, creating an
                    engaged community.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start space-y-3">
                <GlobeIcon className="h-12 w-12 text-primary" />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">
                    Global Reach
                  </h3>
                  <p className="text-muted-foreground">
                    Safewire is accessible worldwide, enabling seamless
                    cross-border transactions.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start space-y-3">
                <FastForwardIcon className="h-12 w-12 text-primary" />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">
                    Fast Transactions
                  </h3>
                  <p className="text-muted-foreground">
                    Experience quick and efficient payment processing with our
                    optimized blockchain technology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="join-as-mod" className="w-full py-12 md:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">
                Join Safewire as a Moderator
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl">
                Become a part of our community and help shape the future of
                decentralized payments.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="#"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Apply Now
                </Link>
              </div>
            </div>
            <div className="mx-auto grid items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <img
                src="/cat-jury.webp"
                width={550}
                height={550}
                alt="Join as a Moderator"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
              />
              <div className="flex flex-col items-start space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">
                    Become a Moderator
                  </h3>
                  <p className="text-muted-foreground">
                    Stake ETH or USDC to participate as a mod, resolve disputes,
                    and earn rewards.
                  </p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">
                    Build Your Reputation
                  </h3>
                  <p className="text-muted-foreground">
                    Gain reputation through fair dispute resolutions and
                    contribute to the Safewire community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
function AccessibilityIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="16" cy="4" r="1" />
      <path d="m18 19 1-7-6 1" />
      <path d="m5 8 3-3 5.5 3-2.36 3.5" />
      <path d="M4.24 14.5a5 5 0 0 0 6.88 6" />
      <path d="M13.76 17.5a5 5 0 0 0-6.88-6" />
    </svg>
  );
}

function BitcoinIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
    </svg>
  );
}
function EthereumIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2L2 12l10 10 10-10L12 2z" />
      <path d="M12 22v-6.5" />
      <path d="M12 2v7.5" />
      <path d="M2 12h20" />
    </svg>
  );
}
function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function DollarSignIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function FastForwardIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 19 22 12 13 5 13 19" />
      <polygon points="2 19 11 12 2 5 2 19" />
    </svg>
  );
}

function GlobeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function InfoIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function LandmarkIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" x2="21" y1="22" y2="22" />
      <line x1="6" x2="6" y1="18" y2="11" />
      <line x1="10" x2="10" y1="18" y2="11" />
      <line x1="14" x2="14" y1="18" y2="11" />
      <line x1="18" x2="18" y1="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </svg>
  );
}

function LockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ReceiptIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 17.5v-11" />
    </svg>
  );
}

function TicketIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}

function WalletIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}
