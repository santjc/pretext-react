export { useTextFlow } from './hooks/useTextFlow'
export { flowText } from './lib/flowText'
export { carveLineSlots, createLineSlotResolver, getCircleBlockedLineRangeForRow, pickWidestLineSlot } from './lib/lineSlots'

export type { UseTextFlowInput, UseTextFlowResult } from './hooks/useTextFlow'
export type { LineSlot, PositionedLine, TextFlowInput, TextFlowResult } from './lib/flowText'
export type { BlockedLineRange, GetBlockedLineRanges, PickLineSlot, LineSlotResolver, CreateLineSlotResolverInput, CircleLineRangeInput } from './lib/lineSlots'
