let protooPort = 4443;

const hostname = process.env.HOSTNAME || 'test.precisely.org';

if (hostname === 'test.precisely.org')
	protooPort = 4444;

export function getProtooUrl(
	{ roomId, peerId }:
	{ roomId: string; peerId: string; }
): string
{
	return `wss://${hostname}:${protooPort}/?roomId=${roomId}&peerId=${peerId}`;
}
