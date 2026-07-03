import RustIcon from "../assets/rust.svg?react";
import CppIcon from "../assets/cpp.svg?react";
import LuaIcon from "../assets/lua.svg?react";
import PythonIcon from "../assets/python.svg?react";
import JavaIcon from "../assets/java.svg?react";
import GearIcon from "../assets/gear.svg?react";
import PackageIcon from "../assets/package.svg?react";
import ArrayIcon from "../assets/array.svg?react";
import AbcIcon from "../assets/abc.svg?react";
import MapIcon from "../assets/map.svg?react";
import CardsIcon from "../assets/cards.svg?react";
import TreeIcon from "../assets/tree.svg?react";
import TargetIcon from "../assets/target.svg?react";
import StackIcon from "../assets/stack.svg?react";
import LoopIcon from "../assets/loop.svg?react";
import ChartIcon from "../assets/chart.svg?react";
import PuzzleIcon from "../assets/puzzle.svg?react";
import NetworkIcon from "../assets/network.svg?react";
import NumbersIcon from "../assets/numbers.svg?react";
import LockIcon from "../assets/lock.svg?react";
import IoIcon from "../assets/io.svg?react";
import SearchIcon from "../assets/search.svg?react";
import SunIcon from "../assets/sun.svg?react";
import MoonIcon from "../assets/moon.svg?react";
import MenuIcon from "../assets/menu.svg?react";
import BookIcon from "../assets/book.svg?react";
import BookOpenIcon from "../assets/book-open.svg?react";
import KeyboardIcon from "../assets/keyboard.svg?react";

const icons = {
  rust: RustIcon,
  cpp: CppIcon,
  lua: LuaIcon,
  python: PythonIcon,
  java: JavaIcon,
  gear: GearIcon,
  package: PackageIcon,
  array: ArrayIcon,
  abc: AbcIcon,
  map: MapIcon,
  cards: CardsIcon,
  tree: TreeIcon,
  target: TargetIcon,
  stack: StackIcon,
  loop: LoopIcon,
  chart: ChartIcon,
  puzzle: PuzzleIcon,
  network: NetworkIcon,
  numbers: NumbersIcon,
  lock: LockIcon,
  io: IoIcon,
  search: SearchIcon,
  sun: SunIcon,
  moon: MoonIcon,
  menu: MenuIcon,
  book: BookIcon,
  "book-open": BookOpenIcon,
  keyboard: KeyboardIcon,
};

export function Icon({ name, className, size = 16, ...props }) {
  const Component = icons[name];
  if (!Component) {
    return <span className={className}>{name}</span>;
  }
  return (
    <Component
      className={className}
      width={size}
      height={size}
      style={{ verticalAlign: "middle" }}
      {...props}
    />
  );
}
