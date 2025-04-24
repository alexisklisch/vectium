import { create } from 'zustand'

type Devices = 'mobile' | 'pc'
type Store = {
  count: number
  inc: () => void
  updateDevice: (device: Devices) => void
  device: Devices
}

export const useStore = create<Store>()((set) => ({
  device: 'mobile',
  updateDevice: (newDevice: Devices) => set(() => ({ device: newDevice })),
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
}))
