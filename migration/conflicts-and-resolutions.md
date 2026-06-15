# Migration Conflicts and Resolutions

Updated: 2026-06-15

This register prevents stale legacy statements from becoming current truth through repetition.

| Topic | Conflicting or stale source | Resolution in v2 |
|---|---|---|
| Product repository path | Older documents reference previous local folders | The manifest points to `/Users/ciccio/Desktop/Codex/TradersHub-Codex`; GitHub remains code source of truth |
| Launch metrics | Older launch files use `0` or `TBD` without maintained evidence | Use `unknown` when a metric lacks a current source; do not convert missing evidence into zero |
| Beta cohort | Planned testers and outreach were described as active | Count testers only when activation is logged in a maintained source |
| Payment status | Older notes say Lemon Squeezy is pending; code now contains an implementation | Implementation exists, but production transaction and entitlement verification remain open |
| Revenue | Inbox evidence suggested a possible $19 payment | Booked platform revenue remains $0 until the transaction and finance record are verified |
| Signup notification | Early notes questioned whether the flow existed | Later evidence reports Telegram signup notifications active; production route still belongs in verification checks |
| Social distribution | Draft volume was sometimes treated as traction | Only published-content and platform analytics evidence count toward traction |
| Outreach lane | Personal-profile outreach and brand-channel content were conflated | Early educator outreach may use Marco's personal profile; organic Trader's Hub brand content remains a separate lane |
| LinkedIn | Some legacy social material included LinkedIn | LinkedIn is outside the approved active platform scope unless Marco adds it |
| Launch dates | Q2 war-room dates and May call deadlines have passed | Preserve them as historical evidence; current priorities use dated status reports |
| Release status | A passing local build was treated as near-launch proof | Build success is necessary but does not replace fresh-account, RLS, payment, and production verification |

Legacy sources remain available for audit. They are not authoritative when this register or a newer canonical v2 file resolves the conflict.
