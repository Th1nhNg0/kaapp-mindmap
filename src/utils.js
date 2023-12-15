import qs from "qs";

export function getListLawCategory(page) {
  const query = qs.stringify(
    {
      pagination: {
        pageSize: 1000,
        page: page,
      },
      fields: ["id", "title", "slug"],
      populate: {
        parent: {
          fields: ["id"],
        },
        laws: {
          fields: ["id"],
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  const url = `https://admin.appka.vn/api/law-categories?${query}`;
  return fetch(url).then((e) => e.json());
}

// export function getd3TreeFormat(slug) {
//   return getLawCategoryBySlug(slug).then(async (res) => {
//     let tempData = {};
//     tempData.name = res.attributes.title;
//     const promises = [];
//     for (let child of res.attributes.children.data) {
//       promises.push(getd3TreeFormat(child.attributes.slug));
//     }
//     const results = await Promise.all(promises);
//     tempData.children = results;
//     tempData.attributes = {
//       id: res.id,
//     };
//     return tempData;
//   });
// }

export async function getFullTree() {
  const data = [];
  let page = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const temp = await getListLawCategory(page++);
    data.push(...temp.data);
    if (temp.meta.pagination.page >= temp.meta.pagination.pageCount) break;
  }

  function makeChildren(parentId) {
    const children = [];
    for (let child of data) {
      if (child.attributes.parent.data?.id === parentId) {
        let temp = {
          name: child.attributes.title,
          attributes: {
            id: child.id,
            law_count: child.attributes.laws.data.length,
          },
        };
        temp.children = makeChildren(child.id);
        for (let i = 0; i < temp.children.length; i++) {
          temp.attributes.law_count += temp.children[i].attributes.law_count;
        }
        children.push(temp);
      }
    }
    return children;
  }

  const slug = [
    "luat-chung",
    "luat-chuyen-nganh",
    "hanh-phap",
    "duong-su",
    "to-tung",
  ];
  const root = {
    name: "ROOT",
    children: [],
    attributes: {
      law_count: 0,
    },
  };
  for (let parent of slug) {
    const find = data.find((e) => e.attributes.slug === parent);
    let temp = {
      name: find.attributes.title,
      attributes: {
        id: find.id,
        law_count: find.attributes.laws.data.length,
      },
    };
    temp.children = makeChildren(temp.attributes.id);
    for (let i = 0; i < temp.children.length; i++) {
      temp.attributes.law_count += temp.children[i].attributes.law_count;
    }
    root.children.push(temp);
  }
  root.attributes.law_count = root.children.reduce(
    (acc, cur) => acc + cur.attributes.law_count,
    0
  );
  return root;
}
