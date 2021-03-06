import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { EOLocaleContext, IEOLocaleContext } from './context';
import { Omit } from './models';
import { EOLocaleProvider } from './provider';

export interface IWithLocaleProps extends Omit<IEOLocaleContext, 'messages'> {}

export function withLocale<T extends {} = {}>(WrappedComponent: React.ComponentClass): React.ComponentClass<T, {}> {
	return class WithLocale extends React.PureComponent<T, {}> {
		public render() {
			return (
				<EOLocaleContext.Consumer>
					{context => {
						// TODO fix any
						const { children, ...sharedProps } = this.props as any;
						const sharedOptions = {
							...sharedProps,
						};
						const sharedOptionsKeys = Object.keys(sharedOptions);
						sharedOptionsKeys.forEach(sharedOptionKey => {
							const sharedOption = sharedOptions[sharedOptionKey];

							if (React.isValidElement(sharedOption)) {
								sharedOptions[sharedOptionKey] = renderToStaticMarkup(
									<EOLocaleProvider
										isEditable={context.isEditable}
										language={context.language}
										locales={context.locales}
									>
										{sharedOption}
									</EOLocaleProvider>,
								);
							}
						});

						return <WrappedComponent {...sharedOptions} {...context} />;
					}}
				</EOLocaleContext.Consumer>
			);
		}
	};
}
