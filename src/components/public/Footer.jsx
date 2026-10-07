import {
  HeartPulse,
  ExternalLink,
} from "lucide-react";

function Footer() {
  return (
    <footer
      id="footer"
      className="border-t border-slate-200 bg-[#0b1f45] text-white"
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-6 lg:px-8">

        <div className="grid gap-10 md:grid-cols-3">

          {/* =================================================
              BRAND
          ================================================= */}

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                <HeartPulse size={24} />
              </div>

              <div>
                <h2 className="text-xl font-extrabold">
                  MediCare
                </h2>

                <p className="text-xs text-blue-200">
                  Hospital Management
                </p>
              </div>

            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
              A modern digital healthcare platform for
              appointments, doctors and digital healthcare
              records.
            </p>

          </div>


          {/* =================================================
              QUICK LINKS
          ================================================= */}

          <div>

            <h3 className="text-sm font-bold uppercase tracking-wider">
              Quick Links
            </h3>

            <div className="mt-5 space-y-3">

              <a
                href="/"
                className="block text-sm text-slate-300 transition hover:text-blue-300"
              >
                Home
              </a>

              <a
                href="#doctor-search"
                className="block text-sm text-slate-300 transition hover:text-blue-300"
              >
                Find a Doctor
              </a>

              <a
                href="#features"
                className="block text-sm text-slate-300 transition hover:text-blue-300"
              >
                Services
              </a>

              <a
                href="#footer"
                className="block text-sm text-slate-300 transition hover:text-blue-300"
              >
                Contact
              </a>

            </div>

          </div>


          {/* =================================================
              CONTACT / DEVELOPER
          ================================================= */}

          <div>

            <h3 className="text-sm font-bold uppercase tracking-wider">
              Developer
            </h3>

            <div className="mt-5">

              <p className="text-base font-bold">
                Vivek Kumar
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Java Backend Developer
              </p>


              {/* SOCIAL BUTTONS */}

              <div className="mt-5 flex gap-3">

                {/* GITHUB */}

                <a
                  href="https://github.com/vivek280304"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xs font-extrabold text-white transition hover:bg-blue-600"
                >
                  Git
                </a>


                {/* INSTAGRAM */}

               

              </div>


              {/* GITHUB */}

              <a
                href="https://github.com/vivek280304"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-2 text-sm text-slate-300 transition hover:text-blue-300"
              >
                github.com/vivek280304

                <ExternalLink size={13} />
              </a>


              {/* INSTAGRAM */}

             

            </div>

          </div>

        </div>


        {/* =================================================
            BOTTOM
        ================================================= */}

        <div className="mt-10 border-t border-white/10 pt-6">

          <div className="flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">

            <p>
              © {new Date().getFullYear()} MediCare.
              All rights reserved.
            </p>

            <p>
              Designed & developed by{" "}

              <span className="font-semibold text-blue-300">
                Vivek Kumar
              </span>
            </p>

          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;