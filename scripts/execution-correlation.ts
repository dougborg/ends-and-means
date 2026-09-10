// Optional private correlation metadata, deliberately outside source/content hashes.
export function executionRunIdentity(env: NodeJS.ProcessEnv = process.env) {
  const value = env.ENDS_MEANS_EXECUTION_RUN_ID;
  if (
    value !== undefined &&
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
      value,
    )
  )
    throw new Error("EXECUTION_RUN_ID_INVALID");
  return value;
}
