const showForGroup = {
  menu: false,
  menuOuter: false,
  header: false,
  chalkboard: false
}

type GroupsKey = keyof typeof showForGroup

const debugBorder = (color: string, group?: string) => (
  (color === 'off' || (group && group in showForGroup && !showForGroup[group as GroupsKey]) ) 
    ? 
    {} 
    : 
    {
      borderWidth: 0.5,
      borderColor: color,
    }
)

export default debugBorder