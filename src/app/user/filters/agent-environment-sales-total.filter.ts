import { IAgentEnvironment } from "@api/agent";
import { groupBy, sum } from "../../share/utility/arrays";

export const agentEnvironmentSalesTotal = ['$translate', ($translate) => (agentEnvironment: IAgentEnvironment) => {
	const count = sum(agentEnvironment.accounts.map((account) => account.inTranCount));
	if (count > 0) {
		const byCurrency = groupBy((account) => account.currency) (agentEnvironment.accounts);
		const amounts = Object.keys(byCurrency)
			.map((currency) => sum(byCurrency[currency].map((account) => account.inTranAmount)) + ' ' + currency)
			.join(', ');
		return $translate.instant('user.settings.agent.sales.summary', { count, amounts })
	} else {
		return $translate.instant('user.settings.agent.sales.none');
	}
}];