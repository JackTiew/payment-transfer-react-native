import { Bank } from './types';

export const BANKS: Bank[] = [
	{ id: 'maybank', name: 'Maybank' },
	{ id: 'cimb', name: 'CIMB Bank' },
	{ id: 'public', name: 'Public Bank' },
	{ id: 'rhb', name: 'RHB Bank' },
	{ id: 'hongleong', name: 'Hong Leong Bank' },
	{ id: 'ambank', name: 'AmBank' },
	{ id: 'bankislam', name: 'Bank Islam' },
	{ id: 'bsn', name: 'BSN' },
];

export function getBankById(id: string): Bank | undefined {
	return BANKS.find((bank) => bank.id === id);
}
