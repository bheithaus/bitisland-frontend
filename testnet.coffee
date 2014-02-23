networks    = require('bitcore/networks');
Peer        = require('bitcore/Peer').class();
Transaction = require('bitcore/Transaction').class();
Address     = require('bitcore/Address').class();
Script      = require('bitcore/Script').class();
coinUtil    = require('bitcore/util/util');
PeerManager = require('bitcore/PeerManager').createClass({
  network: networks.testnet
});

createTx = () ->
  TXIN = "d05f35e0bbc495f6dcab03e599c8f5e32a07cdb4bc76964de201d06a2a7d8265"
  TXIN_N = 0
  ADDR = 'muHct3YZ9Nd5Pq7uLYYhXRAxeW4EnpcaLz'
  VAL = '1.234'
  txobj = {}
  txobj.version = 1
  txobj.lock_time = 0
  txobj.ins = []
  txobj.outs = []
  txin = {}
  txin.s = coinUtil.EMPTY_BUFFER
  txin.q = 0xffffffff

  hash = new Buffer(TXIN, 'hex')
  hash.reverse()
  vout = parseInt(TXIN_N)
  voutBuf = new Buffer(4)
  voutBuf.writeUInt32LE(vout, 0)
  txin.o = Buffer.concat([hash, voutBuf])
  txobj.ins.push(txin)

  addr = new Address(ADDR)
  script = Script.createPubKeyHashOut(addr.payload())
  valueNum = coinUtil.parseValue(VAL)
  value = coinUtil.bigIntToValue(valueNum)

  txout =
    v: value
    s: script.getBuffer()

  txobj.outs.push(txout)

  new Transaction(txobj)


peerman = new PeerManager()
peerman.addPeer( new Peer('127.0.0.1', 18333) )
peerman.on('connect', (conn) ->
  conn = peerman.getActiveConnection()
  if (conn)
    conn.sendTx(createTx())
  conn.on('reject', () -> console.log('Transaction Rejected'))
)
peerman.start();