import { Image } from "antd";

const TestimonialCard = () => {
  return (
    <div className="">
      <div className="relative">
        <div className="z-0">
          <Image
            className="rounded-3xl"
            style={{
              width: 300,
              height: 320,
            }}
            src="https://s3-alpha-sig.figma.com/img/9e62/2d06/32b60d9436266e4f3b6c2f3627a1236c?Expires=1692576000&Signature=GF4332OvW6QbbDWCReUrvB7OHhR4IU5Tv2QD-5QyG-aDmx-8w660gTsEG5aLk0wqw2KDrfDOowRM5p~OLOqytevcUpFUgREKs5j3VoOehD77A2ZTvLkHmyQ6e88hEoSX8ZDQFgudVJf9IzTT~3-hNX4G854CkoLBA5cRjk06pLWn35D0qx~WKnkAnu2XvFazSf9iIRCmygtgBB6Sokq-0UrdTF88-vX4suAFfnhf40hHaxpbzB64NpaMjOIw3lEG063P8FnO3oECS65~teTFWlegP7JdWhGtI-E-qaAhb5OjjQKtzCz9pnKx9zPuR1M0UOcQgRMdJk7wXfeD8tcaFw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4"
          />
        </div>
        <div
          className="bottom-0 left-0 absolute mx-7 flex text-black"
          style={{ width: 244, marginBottom: 34 }}
        >
          <div className="text-base font-medium">
            This is tutorial text and it needs to be edited first
          </div>
        </div>
      </div>
    </div>
  );
};
export default TestimonialCard;
