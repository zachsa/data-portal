import { useContext } from 'react'
import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { context as globalContext } from '../../../../../../contexts/global'
import { Div } from '../../../../../../components/html-tags'

/**
 * Show the selected filters in alphabetical order
 * There should only ever be a few values in the
 * activeFilters array, so don't worry about the
 * double looping
 */
export default ({ activeFilters, filterId }) => {
  const { global, setGlobal } = useContext(globalContext)
  const { terms } = global

  const sortedValues = activeFilters.sort(({ value: a }, { value: b }) =>
    a > b ? 1 : b > a ? -1 : 0
  )

  return sortedValues.map(({ value }) => {
    value = typeof value === 'number' ? `${value}` : value

    const checked = activeFilters?.map(({ value }) => value)?.includes(value) ? true : false

    return (
      <Grid key={value} item xs={12}>
        <Div sx={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            style={{ alignSelf: 'baseline' }}
            size="small"
            color="primary"
            checked={checked}
            onChange={() =>
              setGlobal({
                terms: terms.filter(({ value: _value, filterId: _id }) => {
                  if (filterId !== _id) {
                    return true
                  } else {
                    return value !== _value
                  }
                }),
              })
            }
            inputProps={{ 'aria-label': 'Toggle filter', 'aria-checked': checked }}
          />
          <Tooltip title={value?.toUpperCase()} placement="top">
            <Typography
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                marginRight: theme => theme.spacing(2),
              }}
              variant="overline"
            >{`${typeof value === 'string' ? value.toUpperCase() : value}`}</Typography>
          </Tooltip>
        </Div>
      </Grid>
    )
  })
}
