import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import CheckedinItem from './CheckedinItem';
import { DetailCard } from './DetailCard';

export default function Feed({ wrapperData ,data, dataIdx,item, itemIdx }: any) {
  const navigate = useNavigate();

  return (
    <>
      {item.type === 'minted' && item.image ?
        <CheckedinItem data={{ ...item }} last={(itemIdx + 1) === data?.length && (dataIdx + 1) === Object.entries(wrapperData)?.length} /> :
        <div
          className='mx-5'
        >
          <DetailCard key={itemIdx} data={{ ...item }} last={(itemIdx + 1) === data?.length && (dataIdx + 1) === Object.entries(wrapperData)?.length} />
        </div>
      }</>
  )
}
