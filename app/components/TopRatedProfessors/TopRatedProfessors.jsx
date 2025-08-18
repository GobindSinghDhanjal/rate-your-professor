// import Avatar from "@mui/material/Avatar";
// import { useRouter } from "next/navigation";
// import { Rating, Skeleton } from "@mui/material";
// import styles from "./TopRatedProfessors.module.css";

// export default function TopRatedProfessors({ props }) {
//   const router = useRouter();

//   function onButtonClick(prop) {
//     router.push(`/professor/${prop._id}`);
//   }

//   if (!props || !props.length) {
//     return (
//       <div className={styles.container}>
//         {[1, 2, 3].map((_, i) => (
//           <div className="homepage-avatar" key={i}>
//             <Skeleton variant="circular" width={76} height={76} />
//             <Skeleton variant="text" width={76} height={20} />
//             <Skeleton variant="text" width={76} height={20} />
//           </div>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       {props.map(
//         (prop, i) =>
//           i < 3 && (
//             <div
//               className="homepage-avatar"
//               onClick={() => onButtonClick(prop)}
//               key={i}
//             >
//               <Avatar
//                 className="avatar-image"
//                 alt={prop.name}
//                 src={prop.image}
//                 sx={{
//                   width: 76,
//                   height: 76,
//                 }}
//               />
//               <p>{prop.name}</p>

//               <Rating
//                 name="read-only"
//                 value={prop.averageRating}
//                 precision={0.5}
//                 sx={{ margin: "1px auto", fontSize: 16 }}
//                 readOnly
//               />
//             </div>
//           )
//       )}
//     </div>
//   );
// }

import Avatar from "@mui/material/Avatar";
import { Rating, Skeleton } from "@mui/material";
import Link from "next/link";
import styles from "./TopRatedProfessors.module.css";

export default function TopRatedProfessors({ props }) {
  if (!props || !props.length) {
    return (
      <div className={styles.container}>
        {[1, 2, 3].map((_, i) => (
          <div className="homepage-avatar" key={i}>
            <Skeleton variant="circular" width={76} height={76} />
            <Skeleton variant="text" width={76} height={20} />
            <Skeleton variant="text" width={76} height={20} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {props.slice(0, 3).map((prop, i) => (
        <Link
          key={i}
          href={`/professor/${prop._id}`}
          className={`${styles.homepageAvatar}`}
        >
          <Avatar
            className="avatar-image"
            alt={prop.name}
            src={prop.image}
            sx={{
              width: 76,
              height: 76,
            }}
          />
          <p>{prop.name}</p>

          <Rating
            name="read-only"
            value={prop.averageRating}
            precision={0.5}
            sx={{ margin: "1px auto", fontSize: 16 }}
            readOnly
          />
        </Link>
      ))}
    </div>
  );
}
