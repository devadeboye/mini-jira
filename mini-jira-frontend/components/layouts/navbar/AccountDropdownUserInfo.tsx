export default function AccountDropdownUserInfo({ email, name }: {
	email: string;
	name: string;
}) {
	return (
		<div className="px-4 py-3 border-b border-gray-100">
			<div className="flex items-center space-x-3">
				<div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
					{name?.[0]?.toUpperCase() || "U"}
				</div>
				<div>
					<p className="font-medium text-gray-900 text-sm">
						{name}
					</p>
					<p className="text-xs text-gray-500">{email}</p>
				</div>
			</div>
		</div>
	);
}