const navigation = [
  { name: 'Government', href: '/', current: true },
  { name: 'User', href: '/user', current: false },
  { name: 'Marketplace', href: '/marketplace', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function PlatformMenu() {
    for (let index in navigation) {
        navigation[index].current = navigation[index].href === window.location.pathname;
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
            <div className="flex">
            <div className="flex flex-shrink-0 items-center">
                <img
                className="block h-8 w-auto lg:hidden"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
                />
                <img
                className="hidden h-8 w-auto lg:block"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
                />
            </div>
            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                    item.current
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                >
                    {item.name}
                </a>
                ))}
            </div>
            </div>
            </div>
        </div>
    );
}