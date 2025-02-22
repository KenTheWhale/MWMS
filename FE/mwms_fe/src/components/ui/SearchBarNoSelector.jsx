import css from '../../styles/ui/SearchBar.module.css'
import PropTypes from "prop-types";

SearchBarNoSelector.propTypes = {
    mainWidth: PropTypes.number.isRequired,
    mainMarginBottom: PropTypes.number.isRequired,
    mainMarginTop: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    ph: PropTypes.string.isRequired,
    searchFunc: PropTypes.func.isRequired
}

/* eslint-disable react/prop-types*/

function RenderSearchBar(
    {
        mainWidth,
        height,
        ph,
        searchFunc
    }
) {
    return (
        <div className={css.search_bar} style={{width: mainWidth + 'vw'}}>
            <div className={css.search_input} style={{height: height + 'vh', width: '100%'}}>
                <input type={"text"} placeholder={ph} onChange={(e) => searchFunc(e.target.value)}/>
            </div>
        </div>
    )
}

export function SearchBarNoSelector(
    {
        mainWidth,
        mainMarginBottom,
        mainMarginTop,
        height,
        ph,
        searchFunc
    }
) {
    const prop = {
        mainWidth,
        height,
        ph,
        searchFunc
    }

    return (
        <div className={css.main}
             style={{width: mainWidth + 'vw', marginBottom: mainMarginBottom + 'vh', marginTop: mainMarginTop + 'vh'}}>
            <RenderSearchBar {...prop}/>
        </div>
    )
}