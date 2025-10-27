import useTime from "@/hooks/useTime";

const Footer = () => {
	const time = useTime();
	return (
		<footer className="flex flex-col items-center justify-center gap-2 max-w-7xl mx-auto w-full mb-8  px-4 ">
			<h1 className="text-[13vw] h-full font-extrabold text-transparent text-center leading-none select-none bg-clip-text bg-linear-to-t from-neutral-800 to-neutral-200 opacity-10  mask-b-from-30% mask-b-to-90%">
				SecondBrain
			</h1>
			<div className="w-full flex justify-around flex-wrap gap-2 text-center">
				<p className="text-transparent leading-none select-none bg-clip-text bg-linear-to-t from-neutral-500 to-neutral-200">
					Copyright © 2025 SecondBrain
				</p>
				<p className="text-transparent leading-none select-none bg-clip-text bg-linear-to-t from-neutral-500 to-neutral-200">
					Time -&gt; {time}
				</p>
				<p className="text-transparent leading-none select-none bg-clip-text bg-linear-to-t from-neutral-500 to-neutral-200">
					secondbrain@gmail.com
				</p>
			</div>
		</footer>
	);
};

export default Footer;
