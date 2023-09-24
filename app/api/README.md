# Straight A APIs

This is a collection of StraightA APIs. Nulis ini biar gak lupa wkkww

> Note: For headers that is prefixed with `[🛡️]` means they're
> protected (only logged-in users can access)

Every of these types are declared as a zod schema on the file `/app/api/schema.ts`.

### Generic Response error-handling type

```typescript
type ResponseResult<T> =
  | { status: "ok"; payload: T }
  | { status: "err"; reason: string };
```

The type above may be used on the following api response types to provide a unified .

> Small note: ResponseResult doesn't actually exist as a zod schema, it's defined as a function that takes a payload schema and wrap status around it.

### `/api/auth/login`

#### `POST`

```typescript
type Request = {
  username: string;
  password: string;
};

type Response = ResponseResult<{ redirect: string }>;
```

When status field is `ok`, a cookie will be set containing a JWT token

### `/api/auth/register`

#### `POST`

```typescript
type Request = {
  username: string;
  password: string;
};

type Response = ResponseResult<{ redirect: string }>;
```

When response's status field is `ok`, a cookie will be set containing a JWT token.

After a register action is done, the client must get redirected to the url given
on the `redirect` field. The redirect field will be the url of where the user will
get asked a series of questions regarding their preference. This is to ensure that
the user go through the questions flow before doing anything with the dashboard.

Although, the user will get redirected automatically by the middleware if they haven't
answered the questions yet.

### `[🛡️]` `/api/auth/logout`

#### `POST`

```typescript
type Request = {};

type Response = { status: "ok"; payload: { message: "Telah keluar" } };
```

Yes that's a concrete literal type, what do you expect lol.

### `[🛡️]` `/api/subjects`

#### `GET`

```typescript
type Request = {
  limit: number; // must not exceed 100
  offset: number;
};

type Response = ResponseResult<
  {
    id: number;
    title: string;
    overallScore: number; // an overall score of the user's knowledge about this subject
  }[]
>;
```

### `[🛡️]` `/api/materials`

#### `GET`

```typescript
type Request = {
  subjectId: number;
  limit: number;
  offset: number;
};

type Response = ResponseResult<
  {
    id: number;
    title: string;
    overallScore: number; // an overall score of the user's knowledge about this material
  }[]
>;
```

### `[🛡️]` `/api/study/new`

Creates a new studying session

#### `POST`

```typescript
type Request = {
  focus: {
    subjectId: number;
    materialIds: number[];
  };
};

type Response = ResponseResult<{
  id: number; // study session id
}>;
```

### `[🛡️]` `/api/study/end`

Stops a studying session, with parameters about how the study went.

Will fail if study time and break time does not match with the date the session was created
within the database.

Although, mungkin mereka bisa nge-cheat, tapi pada akhirnya, memang tujuan mereka untuk menggunakan
aplikasi ini untuk apa?

#### `POST`

```typescript
type Request = {
  id: number;
  materials: Record<
    number, // material id
    {
      time: {
        studyTime: number; // relative time in seconds
        breakTime: number; // relative time in seconds
      };
      score: {
        subjective: number;
        objective?: number[];
      };
    }
  >;
};

type Response = ResponseResult<{}>; // no payload
```
