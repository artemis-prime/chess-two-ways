const showForGroup = {
  menu: false
}

type GroupsKey = keyof typeof showForGroup

const debugBorders = (color: string, group?: string) => (
  (color === 'off' || (group && group in showForGroup && !showForGroup[group as GroupsKey]) ) 
    ? 
    {} 
    : 
    {
      borderWidth: 0.5,
      borderColor: color,
    }
)

export default debugBorders